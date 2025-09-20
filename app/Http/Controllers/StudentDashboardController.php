<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class StudentDashboardController extends Controller
{
    public function metrics(Request $request)
    {
        $user = $request->user();

        // Courses in progress (enrolled but not completed)
        $coursesInProgress = Enrollment::with(['course', 'course.sections', 'course.sections.lectures'])
            ->where('user_id', $user->id)
            ->where('status', 'in_progress')
            ->get();

        // Calculate completion percentage for each course
        $coursesWithProgress = $coursesInProgress->map(function ($enrollment) {
            $course = $enrollment->course;
            $totalLectures = $course->sections->sum(function ($section) {
                return $section->lectures->count();
            });

            // For now, assume progress is stored in enrollment or calculate from completed lectures
            // This is simplified - in real app you'd have progress tracking
            $completedLectures = 0; // This would come from a progress table
            $completionPercentage = $totalLectures > 0 ? ($completedLectures / $totalLectures) * 100 : 0;

            return [
                'enrollment' => $enrollment,
                'completion_percentage' => round($completionPercentage, 1),
                'total_lectures' => $totalLectures,
                'completed_lectures' => $completedLectures,
            ];
        });

        // Certificates earned (completed courses)
        $certificatesEarned = Enrollment::where('user_id', $user->id)
            ->where('status', 'completed')
            ->with('course')
            ->count();

        // Total courses enrolled
        $totalEnrolledCourses = Enrollment::where('user_id', $user->id)->count();

        // Recent enrollments
        $recentEnrollments = Enrollment::with('course')
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        // Recommended courses (simplified - courses with high ratings)
        $recommendedCourses = Course::with('reviews')
            ->withAvg('reviews', 'rating')
            ->orderByDesc('reviews_avg_rating')
            ->take(6)
            ->get();

        // Upcoming deadlines (assignments with due dates - assuming assignments table exists)
        $upcomingDeadlines = []; // This would query assignments with due dates

        // Continue learning section - courses with highest progress but not completed
        $continueLearning = $coursesWithProgress
            ->sortByDesc('completion_percentage')
            ->take(3);

        // Overall progress
        $overallProgress = $totalEnrolledCourses > 0
            ? ($certificatesEarned / $totalEnrolledCourses) * 100
            : 0;

        return response()->json([
            'courses_in_progress' => $coursesWithProgress,
            'completion_percentage' => round($overallProgress, 1),
            'certificates_earned' => $certificatesEarned,
            'total_enrolled' => $totalEnrolledCourses,
            'continue_learning' => $continueLearning,
            'recent_enrollments' => $recentEnrollments,
            'recommended_courses' => $recommendedCourses,
            'upcoming_deadlines' => $upcomingDeadlines,
        ]);
    }
}
