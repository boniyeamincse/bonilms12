<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::where('instructor_id', Auth::id())
            ->with('category')
            ->latest()
            ->paginate(10);

        return Inertia::render('Instructor/Courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function create()
    {
        $categories = Category::all();

        return Inertia::render('Instructor/Courses/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'subcategory' => 'nullable|string|max:255',
            'level' => 'required|in:beginner,intermediate,advanced',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:draft,pending_approval,published',
        ]);

        $validated['instructor_id'] = Auth::id();

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('courses', 'public');
        }

        if ($request->hasFile('banner')) {
            $validated['banner'] = $request->file('banner')->store('courses', 'public');
        }

        $course = Course::create($validated);

        return redirect()->route('instructor.courses.edit', $course->id)
            ->with('success', 'Course created successfully!');
    }

    public function show($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with('category')
            ->firstOrFail();

        return Inertia::render('Instructor/Courses/Show', [
            'course' => $course,
        ]);
    }

    public function edit($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with('category')
            ->firstOrFail();

        $categories = Category::all();

        return Inertia::render('Instructor/Courses/Edit', [
            'course' => $course,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, $courseId): RedirectResponse
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'subcategory' => 'nullable|string|max:255',
            'level' => 'required|in:beginner,intermediate,advanced',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:draft,pending_approval,published',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('courses', 'public');
        }

        if ($request->hasFile('banner')) {
            $validated['banner'] = $request->file('banner')->store('courses', 'public');
        }

        $course->update($validated);

        return redirect()->back()->with('success', 'Course updated successfully!');
    }

    public function destroy($courseId): RedirectResponse
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $course->delete();

        return redirect()->route('instructor.courses.index')
            ->with('success', 'Course deleted successfully!');
    }

    public function draft()
    {
        $courses = Course::where('instructor_id', Auth::id())
            ->where('status', 'draft')
            ->with('category')
            ->latest()
            ->paginate(10);

        return Inertia::render('Instructor/Courses/Draft', [
            'courses' => $courses,
        ]);
    }
}