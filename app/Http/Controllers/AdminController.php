<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalUsers = \App\Models\User::count();
        $totalCourses = \App\Models\Course::count();
        $totalEnrollments = \App\Models\Enrollment::count();
        $pendingCourses = \App\Models\Course::where('status', 'pending')->count();

        return inertia('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalCourses' => $totalCourses,
                'totalEnrollments' => $totalEnrollments,
                'pendingCourses' => $pendingCourses,
            ]
        ]);
    }

    public function users()
    {
        $users = \App\Models\User::with('role')->paginate(10);
        return inertia('Admin/Users/Index', compact('users'));
    }

    public function courses()
    {
        $courses = \App\Models\Course::with('instructor')->paginate(10);
        return inertia('Admin/Courses/Index', compact('courses'));
    }

    public function approveCourse(\App\Models\Course $course)
    {
        $course->update(['status' => 'published']);
        return back()->with('success', 'Course approved successfully.');
    }

    public function blockUser(\App\Models\User $user)
    {
        // Implement blocking logic, e.g., add a blocked_at field or status
        return back()->with('success', 'User blocked.');
    }
}
