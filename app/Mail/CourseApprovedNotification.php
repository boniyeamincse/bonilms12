<?php

namespace App\Mail;

use App\Models\Course;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CourseApprovedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $course;

    /**
     * Create a new message instance.
     */
    public function __construct(Course $course)
    {
        $this->course = $course;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Course Has Been Approved - ' . $this->course->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.course-approved',
            with: [
                'courseTitle' => $this->course->title,
                'instructorName' => $this->course->instructor->name,
                'courseUrl' => route('course.show', $this->course->slug),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
