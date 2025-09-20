<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'menu_id',
        'parent_id',
        'title',
        'url',
        'target',
        'type',
        'object_id',
        'order',
        'css_class',
        'attributes',
    ];

    protected $casts = [
        'attributes' => 'array',
        'order' => 'integer',
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function parent()
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('order');
    }

    public function getObjectUrlAttribute()
    {
        if (!$this->url && $this->object_id) {
            switch ($this->type) {
                case 'page':
                    $page = Page::find($this->object_id);
                    return $page ? '/page/' . $page->slug : '#';
                case 'category':
                    $category = Category::find($this->object_id);
                    return $category ? '/blog/category/' . $category->slug : '#';
                case 'post':
                    $post = BlogPost::find($this->object_id);
                    return $post ? '/blog/' . $post->slug : '#';
            }
        }

        return $this->url ?: '#';
    }

    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeByMenu($query, $menuId)
    {
        return $query->where('menu_id', $menuId);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function getFullUrlAttribute()
    {
        return $this->url ?: $this->object_url;
    }

    public function getIsActiveAttribute()
    {
        // Logic to determine if menu item is active based on current URL
        $currentUrl = request()->getRequestUri();

        if ($this->url && str_contains($currentUrl, $this->url)) {
            return true;
        }

        return str_contains($currentUrl, $this->object_url);
    }
}
