<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Theme extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'version',
        'description',
        'author',
        'author_url',
        'theme_uri',
        'license',
        'tags',
        'screenshots',
        'is_active',
        'status',
        'settings',
        'customizer_options',
        'changelog',
        'installed_at',
        'activated_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'screenshots' => 'array',
        'is_active' => 'boolean',
        'settings' => 'array',
        'customizer_options' => 'array',
        'installed_at' => 'datetime',
        'activated_at' => 'datetime',
    ];

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function activate()
    {
        // Deactivate all other themes first
        static::where('id', '!=', $this->id)->update(['is_active' => false]);

        $this->update([
            'is_active' => true,
            'status' => 'active',
            'activated_at' => now(),
        ]);
    }

    public function deactivate()
    {
        $this->update([
            'is_active' => false,
            'status' => 'inactive',
        ]);
    }

    public function uninstall()
    {
        $this->update([
            'status' => 'uninstalled',
            'is_active' => false,
        ]);
    }

    public function getTagListAttribute()
    {
        return is_array($this->tags) ? $this->tags : [];
    }

    public function getScreenshotUrlsAttribute()
    {
        if (!is_array($this->screenshots)) {
            return [];
        }

        return array_map(function ($screenshot) {
            return asset('themes/' . $this->slug . '/' . $screenshot);
        }, $this->screenshots);
    }

    public function getSetting($key, $default = null)
    {
        return data_get($this->settings, $key, $default);
    }

    public function setSetting($key, $value)
    {
        $settings = $this->settings ?? [];
        data_set($settings, $key, $value);
        $this->update(['settings' => $settings]);
    }

    public function getCustomizerOption($key, $default = null)
    {
        return data_get($this->customizer_options, $key, $default);
    }

    public function setCustomizerOption($key, $value)
    {
        $options = $this->customizer_options ?? [];
        data_set($options, $key, $value);
        $this->update(['customizer_options' => $options]);
    }

    public function getThemePath()
    {
        return resource_path('themes/' . $this->slug);
    }

    public function getPublicPath()
    {
        return public_path('themes/' . $this->slug);
    }

    public function getStatusBadgeAttribute()
    {
        switch ($this->status) {
            case 'active':
                return ['label' => 'Active', 'color' => 'green'];
            case 'inactive':
                return ['label' => 'Inactive', 'color' => 'yellow'];
            case 'error':
                return ['label' => 'Error', 'color' => 'red'];
            case 'uninstalled':
                return ['label' => 'Uninstalled', 'color' => 'gray'];
            default:
                return ['label' => 'Installed', 'color' => 'blue'];
        }
    }

    public static function getActiveTheme()
    {
        return static::active()->first();
    }

    public static function setActiveTheme($themeSlug)
    {
        $theme = static::where('slug', $themeSlug)->first();

        if ($theme) {
            $theme->activate();
            return $theme;
        }

        return null;
    }
}
