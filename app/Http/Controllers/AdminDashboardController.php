<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function metrics()
    {
        \Log::info('AdminDashboardController metrics called', [
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name ?? 'unknown'
        ]);

        // Total revenue from successful payments
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');

        // Total enrollments
        $totalEnrollments = Enrollment::count();

        // Active students (users with student role who have enrollments)
        $studentRoleId = \App\Models\Role::where('name', 'student')->first()->id;
        $activeStudents = User::where('role_id', $studentRoleId)
            ->whereHas('enrollments')
            ->count();

        // Instructor payouts (assuming payouts are stored in payments or need separate calculation)
        // For now, calculate instructor earnings as 70% of course revenue
        $instructorPayouts = Payment::where('status', 'completed')
            ->join('courses', 'payments.course_id', '=', 'courses.id')
            ->sum(DB::raw('payments.amount * 0.7'));

        // Additional metrics
        $totalCourses = Course::count();
        $totalInstructors = User::where('role_id', \App\Models\Role::where('name', 'instructor')->first()->id)->count();
        $recentEnrollments = Enrollment::with(['user', 'course'])->latest()->take(5)->get();

        // Chart data - payments over last 30 days
        $paymentsChart = Payment::selectRaw('DATE(created_at) as date, SUM(amount) as revenue')
            ->where('created_at', '>=', now()->subDays(30))
            ->where('status', 'completed')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('revenue', 'date');

        // Enrollments trend
        $enrollmentsChart = Enrollment::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->pluck('count', 'date');

        // Top categories by revenue
        $topCategories = Course::join('payments', 'courses.id', '=', 'payments.course_id')
            ->join('categories', 'courses.category_id', '=', 'categories.id')
            ->selectRaw('categories.name, SUM(payments.amount) as revenue')
            ->where('payments.status', 'completed')
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('revenue', 'desc')
            ->take(5)
            ->get();

        // Count pending withdrawals
        $pendingWithdrawals = \App\Models\Withdrawal::where('status', 'pending')->count();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_enrollments' => $totalEnrollments,
            'active_students' => $activeStudents,
            'instructor_payouts' => $instructorPayouts,
            'total_courses' => $totalCourses,
            'total_instructors' => $totalInstructors,
            'pending_courses' => \App\Models\Course::where('status', 'pending')->count(),
            'pending_withdrawals' => $pendingWithdrawals,
            'recent_enrollments' => $recentEnrollments,
            'charts' => [
                'payments' => $paymentsChart,
                'enrollments' => $enrollmentsChart,
                'top_categories' => $topCategories,
            ],
        ]);
    }

    public function getCourses(Request $request)
    {
        $query = Course::with(['instructor', 'category']);

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $courses = $query->paginate(10);

        return response()->json($courses);
    }

    public function approveCourse(Course $course)
    {
        $course->update(['status' => 'published']);
        return response()->json(['message' => 'Course approved successfully']);
    }

    public function rejectCourse(Course $course)
    {
        $course->update(['status' => 'rejected']);
        return response()->json(['message' => 'Course rejected']);
    }

    public function getPayments(Request $request)
    {
        $query = Payment::with(['user', 'course']);

        if ($request->has('from') && $request->to) {
            $query->whereBetween('created_at', [$request->from, $request->to]);
        }

        $payments = $query->paginate(10);
        return response()->json($payments);
    }

    public function getWithdrawals(Request $request)
    {
        $query = \App\Models\Withdrawal::with('instructor');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $withdrawals = $query->paginate(10);
        return response()->json($withdrawals);
    }

    public function approveWithdrawal(\App\Models\Withdrawal $withdrawal)
    {
        $withdrawal->update(['status' => 'approved', 'processed_at' => now()]);
        return response()->json(['message' => 'Withdrawal approved']);
    }

    public function declineWithdrawal(\App\Models\Withdrawal $withdrawal)
    {
        $withdrawal->update(['status' => 'declined']);
        return response()->json(['message' => 'Withdrawal declined']);
    }
}
