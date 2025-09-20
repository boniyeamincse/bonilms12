<?php

namespace App\Jobs;

use App\Models\Course;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use App\Mail\CourseApprovedNotification;

class SendCourseApprovedEmail implements ShouldQueue
{
    use Queueable;

    protected $course;

    /**
     * Create a new job instance.
     */
    public function __construct(Course $course)
    {
        $this->course = $course;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->course->instructor->email)
            ->send(new CourseApprovedNotification($this->course));
    }
}
