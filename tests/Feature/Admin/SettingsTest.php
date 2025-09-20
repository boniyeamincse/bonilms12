<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $this->admin = User::factory()->create([
            'role_id' => 1, // Assuming admin role id is 1
        ]);
    }

    public function test_admin_can_access_settings_page()
    {
        $response = $this->actingAs($this->admin)
                         ->get('/admin/settings');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Settings/Index')
            ->has('settings')
        );
    }

    public function test_admin_can_update_settings()
    {
        $settingsData = [
            'settings' => [
                [
                    'key' => 'site_name',
                    'value' => 'Test LMS',
                    'group' => 'site'
                ],
                [
                    'key' => 'site_description',
                    'value' => 'Test Description',
                    'group' => 'site'
                ]
            ]
        ];

        $response = $this->actingAs($this->admin)
                         ->put('/admin/settings', $settingsData);

        $response->assertRedirect();
        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'value' => 'Test LMS',
            'group' => 'site'
        ]);
    }

    public function test_admin_can_get_settings_by_group()
    {
        // Create test settings
        Setting::create([
            'key' => 'mail_driver',
            'value' => 'smtp',
            'group' => 'email',
            'type' => 'select'
        ]);

        $response = $this->actingAs($this->admin)
                         ->get('/admin/settings/group/email');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['key', 'value', 'group', 'type']
        ]);
    }

    public function test_admin_can_update_settings_by_group()
    {
        $settingsData = [
            'settings' => [
                'mail_driver' => 'smtp',
                'mail_host' => 'smtp.test.com'
            ]
        ];

        $response = $this->actingAs($this->admin)
                         ->put('/admin/settings/group/email', $settingsData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('settings', [
            'key' => 'mail_driver',
            'value' => 'smtp',
            'group' => 'email'
        ]);
    }

    public function test_admin_can_initialize_default_settings()
    {
        $response = $this->actingAs($this->admin)
                         ->post('/admin/settings/initialize');

        $response->assertStatus(200);
        $this->assertDatabaseHas('settings', [
            'key' => 'site_name',
            'group' => 'site'
        ]);
    }

    public function test_settings_are_cached()
    {
        // Create a setting
        Setting::create([
            'key' => 'test_key',
            'value' => 'test_value',
            'group' => 'test',
            'type' => 'text'
        ]);

        // First call should cache
        $value1 = Setting::get('test_key');

        // Modify directly in database
        Setting::where('key', 'test_key')->update(['value' => 'modified_value']);

        // Second call should return cached value
        $value2 = Setting::get('test_key');

        $this->assertEquals('test_value', $value2);
    }
}