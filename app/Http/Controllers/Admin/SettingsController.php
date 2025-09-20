<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
            'settings.*.group' => 'required|string',
        ]);

        foreach ($validated['settings'] as $settingData) {
            Setting::set(
                $settingData['key'],
                $settingData['value'],
                $settingData['group']
            );
        }

        // Clear all settings cache
        Cache::flush();

        return back()->with('success', 'Settings updated successfully.');
    }

    /**
     * Get settings for a specific group
     */
    public function getGroup(Request $request, string $group)
    {
        $settings = Setting::where('group', $group)->get();

        return response()->json($settings);
    }

    /**
     * Update settings for a specific group
     */
    public function updateGroup(Request $request, string $group)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            Setting::set($key, $value, $group);
        }

        // Clear all settings cache
        Cache::flush();

        return response()->json(['message' => 'Settings updated successfully.']);
    }

    /**
     * Initialize default settings for all groups
     */
    public function initializeDefaults()
    {
        $defaults = [
            // Site settings
            ['key' => 'site_name', 'value' => 'BONI LMS', 'group' => 'site', 'type' => 'text', 'label' => 'Site Name'],
            ['key' => 'site_description', 'value' => 'Learning Management System', 'group' => 'site', 'type' => 'textarea', 'label' => 'Site Description'],
            ['key' => 'site_url', 'value' => 'https://bonilms.com', 'group' => 'site', 'type' => 'url', 'label' => 'Site URL'],
            ['key' => 'site_email', 'value' => 'admin@bonilms.com', 'group' => 'site', 'type' => 'email', 'label' => 'Site Email'],
            ['key' => 'site_phone', 'value' => '', 'group' => 'site', 'type' => 'text', 'label' => 'Site Phone'],

            // Email settings
            ['key' => 'mail_driver', 'value' => 'smtp', 'group' => 'email', 'type' => 'select', 'label' => 'Mail Driver'],
            ['key' => 'mail_host', 'value' => 'smtp.gmail.com', 'group' => 'email', 'type' => 'text', 'label' => 'Mail Host'],
            ['key' => 'mail_port', 'value' => '587', 'group' => 'email', 'type' => 'number', 'label' => 'Mail Port'],
            ['key' => 'mail_username', 'value' => '', 'group' => 'email', 'type' => 'text', 'label' => 'Mail Username'],
            ['key' => 'mail_password', 'value' => '', 'group' => 'email', 'type' => 'password', 'label' => 'Mail Password'],
            ['key' => 'mail_encryption', 'value' => 'tls', 'group' => 'email', 'type' => 'select', 'label' => 'Mail Encryption'],
            ['key' => 'mail_from_address', 'value' => 'noreply@bonilms.com', 'group' => 'email', 'type' => 'email', 'label' => 'From Address'],

            // Payment settings
            ['key' => 'payment_gateway', 'value' => 'stripe', 'group' => 'payments', 'type' => 'select', 'label' => 'Payment Gateway'],
            ['key' => 'stripe_publishable_key', 'value' => '', 'group' => 'payments', 'type' => 'text', 'label' => 'Stripe Publishable Key'],
            ['key' => 'stripe_secret_key', 'value' => '', 'group' => 'payments', 'type' => 'password', 'label' => 'Stripe Secret Key'],
            ['key' => 'paypal_client_id', 'value' => '', 'group' => 'payments', 'type' => 'text', 'label' => 'PayPal Client ID'],
            ['key' => 'paypal_secret', 'value' => '', 'group' => 'payments', 'type' => 'password', 'label' => 'PayPal Secret'],
            ['key' => 'currency', 'value' => 'USD', 'group' => 'payments', 'type' => 'text', 'label' => 'Currency'],

            // S3 settings
            ['key' => 's3_enabled', 'value' => 'false', 'group' => 's3', 'type' => 'boolean', 'label' => 'Enable S3 Storage'],
            ['key' => 's3_key', 'value' => '', 'group' => 's3', 'type' => 'text', 'label' => 'AWS Access Key'],
            ['key' => 's3_secret', 'value' => '', 'group' => 's3', 'type' => 'password', 'label' => 'AWS Secret Key'],
            ['key' => 's3_region', 'value' => 'us-east-1', 'group' => 's3', 'type' => 'text', 'label' => 'AWS Region'],
            ['key' => 's3_bucket', 'value' => '', 'group' => 's3', 'type' => 'text', 'label' => 'S3 Bucket Name'],

            // Cache settings
            ['key' => 'cache_driver', 'value' => 'file', 'group' => 'cache', 'type' => 'select', 'label' => 'Cache Driver'],
            ['key' => 'cache_ttl', 'value' => '3600', 'group' => 'cache', 'type' => 'number', 'label' => 'Cache TTL (seconds)'],
            ['key' => 'redis_host', 'value' => '127.0.0.1', 'group' => 'cache', 'type' => 'text', 'label' => 'Redis Host'],
            ['key' => 'redis_port', 'value' => '6379', 'group' => 'cache', 'type' => 'number', 'label' => 'Redis Port'],
        ];

        foreach ($defaults as $default) {
            Setting::firstOrCreate(
                ['key' => $default['key']],
                $default
            );
        }

        return response()->json(['message' => 'Default settings initialized.']);
    }
}