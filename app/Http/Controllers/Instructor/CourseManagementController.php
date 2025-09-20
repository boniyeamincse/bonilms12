<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Section;
use App\Models\Lecture;
use App\Models\Quiz;
use App\Models\Assignment;
use App\Models\Enrollment;
use App\Models\Review;
use App\Models\Payment;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class CourseManagementController extends Controller
{
    public function index($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Index', [
            'course' => $course,
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

    public function overview($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with('category')
            ->firstOrFail();

        $categories = Category::all();

        return Inertia::render('Instructor/CourseManagement/Overview', [
            'course' => $course,
            'categories' => $categories,
        ]);
    }

    public function curriculum($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with(['sections.lectures'])
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Curriculum', [
            'course' => $course,
        ]);
    }

    public function storeSection(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer|min:0',
        ]);

        $section = $course->sections()->create($validated);

        return response()->json($section);
    }

    public function updateSection(Request $request, $courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $section = $course->sections()->findOrFail($sectionId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer|min:0',
        ]);

        $section->update($validated);

        return response()->json($section);
    }

    public function deleteSection(Request $request, $courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $section = $course->sections()->findOrFail($sectionId);
        $section->delete();

        return response()->json(['message' => 'Section deleted successfully']);
    }

    public function storeLecture(Request $request, $courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $section = $course->sections()->findOrFail($sectionId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:video,text,quiz,assignment',
            'content' => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
            'order' => 'nullable|integer|min:0',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240', // 10MB max
        ]);

        if ($request->hasFile('attachments')) {
            $attachments = [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('lecture-attachments', 'public');
                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                ];
            }
            $validated['attachments'] = $attachments;
        }

        $lecture = $section->lectures()->create($validated);

        return response()->json($lecture);
    }

    public function updateLecture(Request $request, $courseId, $sectionId, $lectureId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $section = $course->sections()->findOrFail($sectionId);
        $lecture = $section->lectures()->findOrFail($lectureId);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:video,text,quiz,assignment',
            'content' => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
            'order' => 'nullable|integer|min:0',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240',
        ]);

        if ($request->hasFile('attachments')) {
            $attachments = $lecture->attachments ?? [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('lecture-attachments', 'public');
                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                ];
            }
            $validated['attachments'] = $attachments;
        }

        $lecture->update($validated);

        return response()->json($lecture);
    }

    public function deleteLecture(Request $request, $courseId, $sectionId, $lectureId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $section = $course->sections()->findOrFail($sectionId);
        $lecture = $section->lectures()->findOrFail($lectureId);
        $lecture->delete();

        return response()->json(['message' => 'Lecture deleted successfully']);
    }

    public function quizzes($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with(['sections.lectures.quiz'])
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Quizzes', [
            'course' => $course,
        ]);
    }

    public function assignments($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with(['sections.lectures.assignment'])
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Assignments', [
            'course' => $course,
        ]);
    }

    public function pricing($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Pricing', [
            'course' => $course,
        ]);
    }

    public function updatePricing(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'pricing_type' => 'required|in:free,paid,subscription',
            'price' => 'required_if:pricing_type,paid|nullable|numeric|min:0',
            'coupon_code' => 'nullable|string|max:50',
            'coupon_discount_type' => 'required_with:coupon_code|in:percentage,fixed',
            'coupon_discount_value' => 'required_with:coupon_code|numeric|min:0',
        ]);

        $course->update($validated);

        return response()->json(['message' => 'Pricing updated successfully']);
    }

    public function dripContent($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with(['sections.lectures'])
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/DripContent', [
            'course' => $course,
        ]);
    }

    public function discussions($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Discussions', [
            'course' => $course,
        ]);
    }

    public function reviews($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with(['reviews.user'])
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Reviews', [
            'course' => $course,
        ]);
    }

    public function enrollments($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with(['enrollments.user'])
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Enrollments', [
            'course' => $course,
        ]);
    }

    public function exportEnrollments($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with(['enrollments.user'])
            ->firstOrFail();

        $enrollments = $course->enrollments->map(function ($enrollment) {
            return [
                'Student Name' => $enrollment->user->name,
                'Email' => $enrollment->user->email,
                'Enrolled At' => $enrollment->enrolled_at->format('Y-m-d H:i:s'),
                'Completion %' => $enrollment->completion_percentage . '%',
                'Grade' => $enrollment->grade ? $enrollment->grade . '%' : 'N/A',
                'Completed At' => $enrollment->completed_at ? $enrollment->completed_at->format('Y-m-d H:i:s') : 'Not completed',
            ];
        });

        $filename = 'course_' . $course->slug . '_enrollments_' . now()->format('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($enrollments) {
            $file = fopen('php://output', 'w');

            if ($enrollments->isNotEmpty()) {
                fputcsv($file, array_keys($enrollments->first()));
            }

            foreach ($enrollments as $enrollment) {
                fputcsv($file, $enrollment);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function certificates($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with(['certificates.enrollment.user'])
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Certificates', [
            'course' => $course,
        ]);
    }

    public function generateCertificate(Request $request, $courseId, $enrollmentId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $enrollment = $course->enrollments()->findOrFail($enrollmentId);

        // Check if student completed the course
        if (!$enrollment->completed_at || $enrollment->completion_percentage < 100) {
            return response()->json(['error' => 'Student has not completed the course'], 400);
        }

        // Check if certificate already exists
        $existingCertificate = $enrollment->certificate;
        if ($existingCertificate) {
            return response()->json(['error' => 'Certificate already exists'], 400);
        }

        // Generate certificate
        $certificate = Certificate::create([
            'enrollment_id' => $enrollment->id,
            'course_id' => $course->id,
            'user_id' => $enrollment->user_id,
            'certificate_number' => 'CERT-' . strtoupper(uniqid()),
            'template' => $request->template ?? 'default',
            'issued_at' => now(),
            'custom_data' => [
                'instructor_name' => $course->instructor->name,
                'course_title' => $course->title,
                'completion_date' => $enrollment->completed_at->format('Y-m-d'),
                'grade' => $enrollment->grade,
            ],
        ]);

        return response()->json($certificate->load('enrollment.user'));
    }

    public function downloadCertificate($courseId, $certificateId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        $certificate = $course->certificates()->findOrFail($certificateId);

        // Generate PDF (simplified - in real implementation, use a PDF library)
        $pdfContent = $this->generateCertificatePDF($certificate);

        $filename = 'certificate_' . $certificate->certificate_number . '.pdf';

        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    private function generateCertificatePDF($certificate)
    {
        // Simplified PDF generation - in real implementation, use TCPDF, DomPDF, etc.
        $html = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .certificate { border: 5px solid #333; padding: 50px; max-width: 800px; margin: 0 auto; }
                .title { font-size: 36px; font-weight: bold; margin: 30px 0; }
                .content { font-size: 18px; line-height: 1.6; }
                .signature { margin-top: 50px; font-style: italic; }
            </style>
        </head>
        <body>
            <div class='certificate'>
                <h1 class='title'>Certificate of Completion</h1>
                <div class='content'>
                    <p>This is to certify that</p>
                    <h2>{$certificate->enrollment->user->name}</h2>
                    <p>has successfully completed the course</p>
                    <h3>{$certificate->course->title}</h3>
                    <p>on {$certificate->issued_at->format('F j, Y')}</p>
                    " . ($certificate->custom_data['grade'] ? "<p>with a grade of {$certificate->custom_data['grade']}%</p>" : "") . "
                </div>
                <div class='signature'>
                    <p>Instructor: {$certificate->custom_data['instructor_name']}</p>
                    <p>Certificate Number: {$certificate->certificate_number}</p>
                </div>
            </div>
        </body>
        </html>
        ";

        return $html; // Return HTML instead of PDF for simplicity
    }

    public function earnings($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->with(['payments'])
            ->firstOrFail();

        // Calculate earnings
        $totalEarnings = $course->payments()->where('status', 'completed')->sum('amount');

        return Inertia::render('Instructor/CourseManagement/Earnings', [
            'course' => $course,
            'totalEarnings' => $totalEarnings,
        ]);
    }

    public function settings($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Settings', [
            'course' => $course,
        ]);
    }

    public function publish($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Instructor/CourseManagement/Publish', [
            'course' => $course,
        ]);
    }
}
