<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\BlogPost;
use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class CmsController extends Controller
{
    // Pages Management
    public function pages()
    {
        $pages = Page::with('author')
            ->orderBy('updated_at', 'desc')
            ->paginate(15);

        return inertia('Admin/CMS/Pages/Index', compact('pages'));
    }

    public function pagesStore(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'status' => 'required|in:draft,published,scheduled',
            'template' => 'nullable|string',
            'seo_meta.title' => 'nullable|string|max:255',
            'seo_meta.description' => 'nullable|string|max:500',
            'seo_meta.keywords' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->all();
        $data['author_id'] = auth()->id();
        $data['slug'] = $request->slug ?: \Str::slug($request->title);

        $page = Page::create($data);

        return response()->json([
            'message' => 'Page created successfully',
            'page' => $page
        ]);
    }

    public function pagesUpdate(Request $request, Page $page)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug,' . $page->id,
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'status' => 'required|in:draft,published,scheduled',
            'template' => 'nullable|string',
            'seo_meta.title' => 'nullable|string|max:255',
            'seo_meta.description' => 'nullable|string|max:500',
            'seo_meta.keywords' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->all();
        $data['slug'] = $request->slug ?: \Str::slug($request->title);

        $page->update($data);

        return response()->json([
            'message' => 'Page updated successfully',
            'page' => $page
        ]);
    }

    // Blog Posts Management
    public function blogPosts()
    {
        $posts = BlogPost::with(['author', 'category'])
            ->orderBy('updated_at', 'desc')
            ->paginate(15);

        $categories = \App\Models\Category::active()->get();

        return inertia('Admin/CMS/Blog/Index', compact('posts', 'categories'));
    }

    public function blogPostsStore(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'status' => 'required|in:draft,published,scheduled',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array',
            'seo_meta.title' => 'nullable|string|max:255',
            'seo_meta.description' => 'nullable|string|max:500',
            'seo_meta.keywords' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->all();
        $data['author_id'] = auth()->id();
        $data['slug'] = $request->slug ?: \Str::slug($request->title);

        $post = BlogPost::create($data);

        return response()->json([
            'message' => 'Blog post created successfully',
            'post' => $post->load(['author', 'category'])
        ]);
    }

    public function blogPostsUpdate(Request $request, BlogPost $blogPost)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug,' . $blogPost->id,
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'status' => 'required|in:draft,published,scheduled',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|array',
            'seo_meta.title' => 'nullable|string|max:255',
            'seo_meta.description' => 'nullable|string|max:500',
            'seo_meta.keywords' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->all();
        $data['slug'] = $request->slug ?: \Str::slug($request->title);

        $blogPost->update($data);

        return response()->json([
            'message' => 'Blog post updated successfully',
            'post' => $blogPost->load(['author', 'category'])
        ]);
    }

    // Menus Management
    public function menus()
    {
        $menus = Menu::with(['items' => function($query) {
            $query->with('children')->orderBy('order');
        }])->paginate(10);

        return inertia('Admin/CMS/Menus/Index', compact('menus'));
    }

    public function menusStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:menus',
            'slug' => 'nullable|string|max:255|unique:menus',
            'location' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['name', 'location', 'description', 'is_active']);
        $data['slug'] = $request->slug ?: \Str::slug($request->name);

        $menu = Menu::create($data);

        return response()->json([
            'message' => 'Menu created successfully',
            'menu' => $menu
        ]);
    }

    public function menusUpdate(Request $request, Menu $menu)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:menus,name,' . $menu->id,
            'slug' => 'nullable|string|max:255|unique:menus,slug,' . $menu->id,
            'location' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['name', 'location', 'description', 'is_active']);
        $data['slug'] = $request->slug ?: \Str::slug($request->name);

        $menu->update($data);

        return response()->json([
            'message' => 'Menu updated successfully',
            'menu' => $menu
        ]);
    }

    public function menuItemsStore(Request $request, Menu $menu)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'target' => 'required|in:_self,_blank',
            'type' => 'required|in:custom,page,category,post',
            'object_id' => 'nullable|integer',
            'parent_id' => 'nullable|exists:menu_items,id',
            'css_class' => 'nullable|string|max:255',
        ]);

        $maxOrder = MenuItem::where('menu_id', $menu->id)->max('order') ?? 0;

        $item = MenuItem::create([
            'menu_id' => $menu->id,
            'title' => $request->title,
            'url' => $request->url,
            'target' => $request->target,
            'type' => $request->type,
            'object_id' => $request->object_id,
            'parent_id' => $request->parent_id,
            'order' => $maxOrder + 1,
            'css_class' => $request->css_class,
        ]);

        return response()->json([
            'message' => 'Menu item added successfully',
            'item' => $item
        ]);
    }

    public function menuItemsReorder(Request $request, Menu $menu)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:menu_items,id',
            'items.*.order' => 'required|integer',
            'items.*.parent_id' => 'nullable|integer|exists:menu_items,id',
        ]);

        \DB::transaction(function () use ($request) {
            foreach ($request->items as $itemData) {
                MenuItem::where('id', $itemData['id'])->update([
                    'order' => $itemData['order'],
                    'parent_id' => $itemData['parent_id'] ?? null,
                ]);
            }
        });

        return response()->json([
            'message' => 'Menu items reordered successfully'
        ]);
    }
}
