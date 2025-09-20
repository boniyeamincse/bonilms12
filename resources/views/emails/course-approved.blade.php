<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Congratulations, {{ $instructorName }}!</h1>
        </div>
        <div class="content">
            <p>Your course has been approved and is now live on our platform.</p>
            <h2>{{ $courseTitle }}</h2>
            <p>Students can now enroll in your course and start learning. You can track enrollments and earnings from your instructor dashboard.</p>
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ $courseUrl }}" class="button">View Your Course</a>
            </p>
            <p>Thank you for contributing to our learning community!</p>
            <p>Best regards,<br>The BONI LMS Team</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} BONI LMS. All rights reserved.</p>
        </div>
    </div>
</body>
</html>