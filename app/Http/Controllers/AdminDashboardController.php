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

        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_enrollments' => $totalEnrollments,
            'active_students' => $activeStudents,
            'instructor_payouts' => $instructorPayouts,
            'total_courses' => $totalCourses,
            'total_instructors' => $totalInstructors,
            'recent_enrollments' => $recentEnrollments,
        ]);
    }
}
