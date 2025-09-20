<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with(['parent', 'children'])
            ->withCount('courses')
            ->orderBy('order')
            ->get();

        return inertia('Admin/Categories/Index', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'slug' => 'nullable|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['name', 'description', 'parent_id', 'is_active']);
        $data['slug'] = $request->slug ?: \Str::slug($request->name);

        // Set order based on parent or max order
        if ($request->parent_id) {
            $data['order'] = Category::where('parent_id', $request->parent_id)->max('order') + 1;
        } else {
            $data['order'] = Category::whereNull('parent_id')->max('order') + 1;
        }

        $category = Category::create($data);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category->load(['parent', 'children'])
        ]);
    }

    public function show(Category $category)
    {
        return response()->json($category->load(['parent', 'children', 'courses']));
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
        ]);

        // Prevent circular reference
        if ($request->parent_id && $this->wouldCreateCircularReference($category, $request->parent_id)) {
            return response()->json(['error' => 'Cannot set parent that would create a circular reference'], 422);
        }

        $data = $request->only(['name', 'description', 'parent_id', 'is_active']);
        $data['slug'] = $request->slug ?: \Str::slug($request->name);

        $category->update($data);

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category->load(['parent', 'children'])
        ]);
    }

    public function destroy(Category $category)
    {
        // Check if category has children or courses
        if ($category->children()->count() > 0) {
            return response()->json(['error' => 'Cannot delete category with child categories'], 422);
        }

        if ($category->courses()->count() > 0) {
            return response()->json(['error' => 'Cannot delete category that contains courses'], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|integer|exists:categories,id',
            'categories.*.order' => 'required|integer',
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->categories as $categoryData) {
                Category::where('id', $categoryData['id'])->update([
                    'order' => $categoryData['order']
                ]);
            }
        });

        return response()->json([
            'message' => 'Category order updated successfully'
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:categories,id',
        ]);

        $categories = Category::whereIn('id', $request->ids)->get();

        $errors = [];
        $deletableIds = [];

        foreach ($categories as $category) {
            if ($category->children()->count() > 0) {
                $errors[] = "Category '{$category->name}' has child categories";
            } elseif ($category->courses()->count() > 0) {
                $errors[] = "Category '{$category->name}' contains courses";
            } else {
                $deletableIds[] = $category->id;
            }
        }

        if ($deletableIds) {
            Category::whereIn('id', $deletableIds)->delete();
        }

        return response()->json([
            'message' => count($deletableIds) . ' categories deleted successfully',
            'errors' => $errors
        ]);
    }

    public function toggleActive(Request $request, Category $category)
    {
        $category->update(['is_active' => !$category->is_active]);

        return response()->json([
            'message' => 'Category ' . ($category->is_active ? 'activated' : 'deactivated') . ' successfully',
            'category' => $category
        ]);
    }

    public function tree()
    {
        $categories = Category::with(['children' => function($query) {
            $query->with('children')->orderBy('order');
        }])
        ->whereNull('parent_id')
        ->orderBy('order')
        ->get();

        return response()->json($categories);
    }

    private function wouldCreateCircularReference(Category $category, $newParentId)
    {
        $parent = Category::find($newParentId);
        while ($parent) {
            if ($parent->id === $category->id) {
                return true;
            }
            $parent = $parent->parent;
        }
        return false;
    }
}
