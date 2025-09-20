<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'enrolled_at',
        'completed_at',
        'progress',
        'completion_percentage',
        'grade',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'completed_at' => 'datetime',
        'progress' => 'array',
        'completion_percentage' => 'decimal:2',
        'grade' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function certificate()
    {
        return $this->hasOne(Certificate::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
