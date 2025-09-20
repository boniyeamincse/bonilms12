<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $fillable = [
        'lecture_id',
        'title',
        'description',
        'due_date',
        'attachments',
    ];

    protected $casts = [
        'attachments' => 'array',
        'due_date' => 'datetime',
    ];

    public function lecture()
    {
        return $this->belongsTo(Lecture::class);
    }
}
