<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InstructorDashboardController extends Controller
{
    public function metrics(Request $request)
    {
        $user = $request->user();

        // Today's sales for this instructor's courses
        $todaysSales = Payment::where('status', 'completed')
            ->whereDate('created_at', today())
            ->whereHas('course', function ($query) use ($user) {
                $query->where('instructor_id', $user->id);
            })
            ->sum('amount');

        // Total students enrolled in instructor's courses
        $totalStudents = Enrollment::whereHas('course', function ($query) use ($user) {
            $query->where('instructor_id', $user->id);
        })->distinct('user_id')->count('user_id');

        // Average rating across all instructor's courses
        $averageRating = Review::whereHas('course', function ($query) use ($user) {
            $query->where('instructor_id', $user->id);
        })->avg('rating') ?? 0;

        // Instructor's courses
        $courses = Course::where('instructor_id', $user->id)->withCount(['enrollments', 'reviews'])->get();

        // Course performance analytics
        $courseAnalytics = $courses->map(function ($course) {
            $totalRevenue = Payment::where('course_id', $course->id)
                ->where('status', 'completed')
                ->sum('amount');

            $averageRating = $course->reviews->avg('rating') ?? 0;

            return [
                'course_id' => $course->id,
                'title' => $course->title,
                'enrollments' => $course->enrollments_count,
                'reviews' => $course->reviews_count,
                'average_rating' => round($averageRating, 1),
                'revenue' => $totalRevenue,
            ];
        });

        // Total earnings for instructor (70% of course revenue)
        $totalEarnings = Payment::where('status', 'completed')
            ->whereHas('course', function ($query) use ($user) {
                $query->where('instructor_id', $user->id);
            })
            ->sum(DB::raw('amount * 0.7'));

        // Recent enrollments in instructor's courses
        $recentEnrollments = Enrollment::with(['user', 'course'])
            ->whereHas('course', function ($query) use ($user) {
                $query->where('instructor_id', $user->id);
            })
            ->latest()
            ->take(10)
            ->get();

        // Pending assignments/reviews (assuming assignments model exists)
        $pendingReviews = Review::whereHas('course', function ($query) use ($user) {
            $query->where('instructor_id', $user->id);
        })->where('status', 'pending')->count();

        return response()->json([
            'todays_sales' => $todaysSales,
            'total_students' => $totalStudents,
            'average_rating' => round($averageRating, 1),
            'total_earnings' => $totalEarnings,
            'courses' => $courseAnalytics,
            'recent_enrollments' => $recentEnrollments,
            'pending_reviews' => $pendingReviews,
        ]);
    }
}
