<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
        'label',
        'description',
    ];

    protected $casts = [
        'value' => 'string',
    ];

    /**
     * Get a setting value by key
     */
    public static function get(string $key, $default = null)
    {
        $cacheKey = "setting_{$key}";

        return Cache::remember($cacheKey, 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value, string $group = 'general', string $type = 'text')
    {
        $setting = static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
                'type' => $type,
            ]
        );

        // Clear cache
        Cache::forget("setting_{$key}");

        return $setting;
    }

    /**
     * Get settings by group
     */
    public static function getByGroup(string $group)
    {
        return static::where('group', $group)->get()->pluck('value', 'key');
    }

    /**
     * Get all settings with metadata
     */
    public static function getAllWithMeta()
    {
        return static::all()->keyBy('key');
    }
}
