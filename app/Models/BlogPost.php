<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image',
        'status',
        'seo_meta',
        'tags',
        'reading_time',
        'author_id',
        'category_id',
        'published_at',
    ];

    protected $casts = [
        'seo_meta' => 'array',
        'tags' => 'array',
        'published_at' => 'datetime',
        'reading_time' => 'integer',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function setContentAttribute($value)
    {
        $this->attributes['content'] = $value;

        // Auto-generate excerpt if not provided
        if (empty($this->excerpt)) {
            $this->attributes['excerpt'] = Str::limit(strip_tags($value), 150);
        }

        // Auto-calculate reading time
        $wordCount = str_word_count(strip_tags($value));
        $this->attributes['reading_time'] = ceil($wordCount / 200);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByTag($query, $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }

    public function getSeoTitleAttribute()
    {
        return $this->seo_meta['title'] ?? $this->title;
    }

    public function getSeoDescriptionAttribute()
    {
        return $this->seo_meta['description'] ?? $this->excerpt;
    }

    public function getTagListAttribute()
    {
        return is_array($this->tags) ? $this->tags : [];
    }

    public function getReadingTimeTextAttribute()
    {
        return $this->reading_time . ' min read';
    }
}
