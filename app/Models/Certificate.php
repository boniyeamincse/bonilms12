<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'enrollment_id',
        'course_id',
        'user_id',
        'certificate_number',
        'template',
        'issued_at',
        'custom_data',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'custom_data' => 'array',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
