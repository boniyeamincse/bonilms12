<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    protected $fillable = [
        'instructor_id',
        'amount',
        'method',
        'status',
        'notes',
        'bank_details',
        'processed_at',
    ];

    protected $casts = [
        'bank_details' => 'array',
        'processed_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
