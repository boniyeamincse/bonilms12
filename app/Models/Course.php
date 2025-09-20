<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Course extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'instructor_id',
        'price',
        'image',
        'status',
        'is_featured',
        'subcategory',
        'level',
        'banner',
        'pricing_type',
        'coupon_code',
        'coupon_discount_type',
        'coupon_discount_value',
        'drip_enabled',
        'sequential_unlock',
        'discussions_enabled',
        'access_type',
        'language',
        'prerequisites',
        'max_students',
    ];

    protected static function booted()
    {
        static::saved(function ($course) {
            Cache::tags(['courses'])->flush();
        });

        static::deleted(function ($course) {
            Cache::tags(['courses'])->flush();
        });
    }

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function sections()
    {
        return $this->hasMany(Section::class)->orderBy('order');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public static function getFeaturedCourses()
    {
        return Cache::tags(['courses'])->remember('featured_courses', 3600, function () {
            return static::with(['instructor', 'category'])
                ->where('is_featured', true)
                ->where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->take(12)
                ->get();
        });
    }

    public static function getPopularCourses()
    {
        return Cache::tags(['courses'])->remember('popular_courses', 3600, function () {
            return static::with(['instructor', 'category'])
                ->withCount('enrollments')
                ->where('status', 'published')
                ->orderBy('enrollments_count', 'desc')
                ->take(12)
                ->get();
        });
    }

    public static function getRecentCourses()
    {
        return Cache::tags(['courses'])->remember('recent_courses', 3600, function () {
            return static::with(['instructor', 'category'])
                ->where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->take(12)
                ->get();
        });
    }
}
