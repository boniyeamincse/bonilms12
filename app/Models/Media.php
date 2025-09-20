<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    protected $fillable = [
        'name',
        'file_name',
        'mime_type',
        'path',
        'disk',
        'file_hash',
        'file_size',
        'collection',
        'metadata',
        'uploaded_by',
        'alt_text',
        'description',
        'folder',
        'is_public',
    ];

    protected $casts = [
        'metadata' => 'array',
        'file_size' => 'integer',
        'is_public' => 'boolean',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getUrlAttribute()
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function getSizeForHumansAttribute()
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getTypeAttribute()
    {
        $mime = $this->mime_type;

        if (str_contains($mime, 'image/')) {
            return 'image';
        } elseif (str_contains($mime, 'video/')) {
            return 'video';
        } elseif (str_contains($mime, 'audio/')) {
            return 'audio';
        } elseif (str_contains($mime, 'pdf')) {
            return 'document';
        } elseif (str_contains($mime, 'text/')) {
            return 'text';
        } elseif (str_contains($mime, 'application/')) {
            return 'application';
        }

        return 'file';
    }

    public function scopeByCollection($query, $collection)
    {
        return $query->where('collection', $collection);
    }

    public function scopeByFolder($query, $folder)
    {
        return $query->where('folder', $folder);
    }

    public function scopeImages($query)
    {
        return $query->where('mime_type', 'like', 'image/%');
    }

    public function scopeVideos($query)
    {
        return $query->where('mime_type', 'like', 'video/%');
    }

    public function scopeDocuments($query)
    {
        return $query->whereIn('mime_type', [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]);
    }
}
