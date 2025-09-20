<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lecture extends Model
{
    protected $fillable = [
        'section_id',
        'title',
        'type',
        'content',
        'order',
        'duration',
        'attachments',
    ];

    protected $casts = [
        'attachments' => 'array',
    ];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }
}
