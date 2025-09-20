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
        $totalInstructors = \App\Models\User::whereHas('role', function($q) {
            $q->where('name', 'instructor');
        })->count();

        return inertia('Admin/Dashboard/Index', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_courses' => $totalCourses,
                'total_enrollments' => $totalEnrollments,
                'pending_courses' => $pendingCourses,
                'total_instructors' => $totalInstructors,
            ]
        ]);
    }

    public function users(Request $request)
    {
        $query = \App\Models\User::with('role');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(10)->appends($request->query());
        return inertia('Admin/Users/Index', compact('users'));
    }

    public function courses(Request $request)
    {
        $query = \App\Models\Course::with('instructor');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('instructor', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $courses = $query->paginate(10)->appends($request->query());
        return inertia('Admin/Courses/Index', compact('courses'));
    }

    public function approveCourse(\App\Models\Course $course)
    {
        $course->update(['status' => 'published']);

        // Dispatch background job to send approval email
        \App\Jobs\SendCourseApprovedEmail::dispatch($course);

        return back()->with('success', 'Course approved successfully.');
    }

    public function blockUser(\App\Models\User $user)
    {
        $user->update(['blocked_at' => now()]);
        return back()->with('success', 'User blocked.');
    }

    public function unblockUser(\App\Models\User $user)
    {
        $user->update(['blocked_at' => null]);
        return back()->with('success', 'User unblocked.');
    }

    public function rejectCourse(\App\Models\Course $course)
    {
        $course->update(['status' => 'rejected']);
        return back()->with('success', 'Course rejected.');
    }

    public function payments()
    {
        $payments = \App\Models\Payment::with(['user', 'course'])->paginate(10);
        return inertia('Admin/Payments/Index', compact('payments'));
    }

    public function refundPayment(\App\Models\Payment $payment)
    {
        // Implement refund logic
        $payment->update(['status' => 'refunded']);
        return back()->with('success', 'Payment refunded.');
    }

    public function withdrawals()
    {
        $withdrawals = \App\Models\Withdrawal::with('instructor')->paginate(10);
        return inertia('Admin/Withdrawals/Index', compact('withdrawals'));
    }

    public function approveWithdrawal(\App\Models\Withdrawal $withdrawal)
    {
        $withdrawal->update(['status' => 'approved', 'processed_at' => now()]);
        return back()->with('success', 'Withdrawal approved.');
    }

    public function declineWithdrawal(\App\Models\Withdrawal $withdrawal)
    {
        $withdrawal->update(['status' => 'declined']);
        return back()->with('success', 'Withdrawal declined.');
    }

    public function courseReviewsQueue()
    {
        $courses = \App\Models\Course::with(['instructor', 'category'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->paginate(20);
        return inertia('Admin/Queues/CourseReviews/Index', compact('courses'));
    }

    public function withdrawalsQueue()
    {
        $withdrawals = \App\Models\Withdrawal::with('instructor')
            ->where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->paginate(20);
        return inertia('Admin/Queues/Withdrawals/Index', compact('withdrawals'));
    }
}
