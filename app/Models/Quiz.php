<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'lecture_id',
        'title',
        'questions',
        'passing_score',
        'time_limit',
    ];

    protected $casts = [
        'questions' => 'array',
    ];

    public function lecture()
    {
        return $this->belongsTo(Lecture::class);
    }
}
