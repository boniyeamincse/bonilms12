<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plugin;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ExtensionsController extends Controller
{
    // Plugins Management
    public function plugins()
    {
        $plugins = Plugin::orderBy('name')->get();
        return inertia('Admin/Extensions/Plugins/Index', compact('plugins'));
    }

    public function pluginsUpload(Request $request)
    {
        $request->validate([
            'plugin' => 'required|file|mimes:zip|max:51200', // 50MB max
        ]);

        $file = $request->file('plugin');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('temp/plugins', $filename, 'local');

        try {
            // Extract plugin information from zip
            $pluginInfo = $this->extractPluginInfo(storage_path('app/' . $path));

            // Check if plugin already exists
            $existingPlugin = Plugin::where('slug', $pluginInfo['slug'])->first();

            if ($existingPlugin) {
                // Update existing plugin
                $existingPlugin->update([
                    'version' => $pluginInfo['version'],
                    'description' => $pluginInfo['description'] ?? '',
                    'author' => $pluginInfo['author'] ?? '',
                    'author_url' => $pluginInfo['author_url'] ?? '',
                    'requires' => $pluginInfo['requires'] ?? '',
                    'tested' => $pluginInfo['tested'] ?? '',
                    'requires_php' => $pluginInfo['requires_php'] ?? '',
                    'tags' => $pluginInfo['tags'] ?? [],
                    'status' => 'installed',
                    'installed_at' => now(),
                ]);

                $plugin = $existingPlugin;
            } else {
                // Create new plugin
                $plugin = Plugin::create([
                    'name' => $pluginInfo['name'],
                    'slug' => $pluginInfo['slug'],
                    'version' => $pluginInfo['version'],
                    'description' => $pluginInfo['description'] ?? '',
                    'author' => $pluginInfo['author'] ?? '',
                    'author_url' => $pluginInfo['author_url'] ?? '',
                    'requires' => $pluginInfo['requires'] ?? '',
                    'tested' => $pluginInfo['tested'] ?? '',
                    'requires_php' => $pluginInfo['requires_php'] ?? '',
                    'tags' => $pluginInfo['tags'] ?? [],
                    'capabilities' => $pluginInfo['capabilities'] ?? [],
                    'status' => 'installed',
                    'installed_at' => now(),
                ]);
            }

            // Move plugin files to plugins directory
            $this->installPluginFiles($plugin, storage_path('app/' . $path));

            return response()->json([
                'message' => 'Plugin uploaded successfully',
                'plugin' => $plugin
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to install plugin: ' . $e->getMessage()], 500);
        } finally {
            // Clean up temp file
            Storage::disk('local')->delete($path);
        }
    }

    public function pluginsActivate(Plugin $plugin)
    {
        if (!$plugin->isCompatible()) {
            return response()->json(['error' => 'Plugin is not compatible with your system'], 422);
        }

        $plugin->activate();

        return response()->json([
            'message' => 'Plugin activated successfully',
            'plugin' => $plugin
        ]);
    }

    public function pluginsDeactivate(Plugin $plugin)
    {
        $plugin->deactivate();

        return response()->json([
            'message' => 'Plugin deactivated successfully',
            'plugin' => $plugin
        ]);
    }

    public function pluginsDelete(Plugin $plugin)
    {
        // Remove plugin files
        $this->removePluginFiles($plugin);

        $plugin->delete();

        return response()->json([
            'message' => 'Plugin deleted successfully'
        ]);
    }

    public function pluginsSettings(Plugin $plugin)
    {
        return response()->json($plugin->settings ?? []);
    }

    public function pluginsUpdateSettings(Request $request, Plugin $plugin)
    {
        $plugin->update(['settings' => $request->all()]);

        return response()->json([
            'message' => 'Plugin settings updated successfully'
        ]);
    }

    // Themes Management
    public function themes()
    {
        $themes = Theme::orderBy('name')->get();
        $activeTheme = Theme::active()->first();

        return inertia('Admin/Extensions/Themes/Index', compact('themes', 'activeTheme'));
    }

    public function themesUpload(Request $request)
    {
        $request->validate([
            'theme' => 'required|file|mimes:zip|max:51200', // 50MB max
        ]);

        $file = $request->file('theme');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('temp/themes', $filename, 'local');

        try {
            // Extract theme information from zip
            $themeInfo = $this->extractThemeInfo(storage_path('app/' . $path));

            // Check if theme already exists
            $existingTheme = Theme::where('slug', $themeInfo['slug'])->first();

            if ($existingTheme) {
                // Update existing theme
                $existingTheme->update([
                    'version' => $themeInfo['version'],
                    'description' => $themeInfo['description'] ?? '',
                    'author' => $themeInfo['author'] ?? '',
                    'author_url' => $themeInfo['author_url'] ?? '',
                    'tags' => $themeInfo['tags'] ?? [],
                    'status' => 'installed',
                    'installed_at' => now(),
                ]);

                $theme = $existingTheme;
            } else {
                // Create new theme
                $theme = Theme::create([
                    'name' => $themeInfo['name'],
                    'slug' => $themeInfo['slug'],
                    'version' => $themeInfo['version'],
                    'description' => $themeInfo['description'] ?? '',
                    'author' => $themeInfo['author'] ?? '',
                    'author_url' => $themeInfo['author_url'] ?? '',
                    'tags' => $themeInfo['tags'] ?? [],
                    'customizer_options' => $themeInfo['customizer_options'] ?? [],
                    'status' => 'installed',
                    'installed_at' => now(),
                ]);
            }

            // Move theme files to themes directory
            $this->installThemeFiles($theme, storage_path('app/' . $path));

            return response()->json([
                'message' => 'Theme uploaded successfully',
                'theme' => $theme
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to install theme: ' . $e->getMessage()], 500);
        } finally {
            // Clean up temp file
            Storage::disk('local')->delete($path);
        }
    }

    public function themesActivate(Theme $theme)
    {
        $theme->activate();

        return response()->json([
            'message' => 'Theme activated successfully',
            'theme' => $theme
        ]);
    }

    public function themesDelete(Theme $theme)
    {
        // Remove theme files
        $this->removeThemeFiles($theme);

        $theme->delete();

        return response()->json([
            'message' => 'Theme deleted successfully'
        ]);
    }

    public function themesCustomizer(Theme $theme)
    {
        return response()->json($theme->customizer_options ?? []);
    }

    public function themesUpdateCustomizer(Request $request, Theme $theme)
    {
        $theme->update(['customizer_options' => $request->all()]);

        return response()->json([
            'message' => 'Theme customizer settings updated successfully'
        ]);
    }

    public function themesPreview(Theme $theme)
    {
        // Generate preview URL for theme
        $previewUrl = route('home') . '?theme_preview=' . $theme->slug;

        return response()->json([
            'preview_url' => $previewUrl
        ]);
    }

    // Helper Methods
    private function extractPluginInfo($zipPath)
    {
        // This would extract plugin.json or similar from the zip
        // For now, return mock data
        return [
            'name' => 'Sample Plugin',
            'slug' => 'sample-plugin',
            'version' => '1.0.0',
            'description' => 'A sample plugin',
            'author' => 'Plugin Author',
            'author_url' => 'https://example.com',
            'requires' => '10.0',
            'tested' => '11.0',
            'requires_php' => '8.1',
            'tags' => ['sample', 'demo'],
            'capabilities' => ['users', 'courses']
        ];
    }

    private function extractThemeInfo($zipPath)
    {
        // This would extract theme.json or similar from the zip
        // For now, return mock data
        return [
            'name' => 'Sample Theme',
            'slug' => 'sample-theme',
            'version' => '1.0.0',
            'description' => 'A sample theme',
            'author' => 'Theme Author',
            'author_url' => 'https://example.com',
            'tags' => ['modern', 'responsive'],
            'customizer_options' => [
                'primary_color' => '#007bff',
                'secondary_color' => '#6c757d',
                'font_family' => 'Inter'
            ]
        ];
    }

    private function installPluginFiles(Plugin $plugin, $zipPath)
    {
        // Extract and move plugin files to plugins directory
        $pluginDir = base_path('plugins/' . $plugin->slug);

        if (!File::exists($pluginDir)) {
            File::makeDirectory($pluginDir, 0755, true);
        }

        // Extract zip contents to plugin directory
        // Implementation would use ZipArchive or similar
    }

    private function installThemeFiles(Theme $theme, $zipPath)
    {
        // Extract and move theme files to themes directory
        $themeDir = resource_path('themes/' . $theme->slug);

        if (!File::exists($themeDir)) {
            File::makeDirectory($themeDir, 0755, true);
        }

        // Extract zip contents to theme directory
        // Implementation would use ZipArchive or similar
    }

    private function removePluginFiles(Plugin $plugin)
    {
        $pluginDir = base_path('plugins/' . $plugin->slug);

        if (File::exists($pluginDir)) {
            File::deleteDirectory($pluginDir);
        }
    }

    private function removeThemeFiles(Theme $theme)
    {
        $themeDir = resource_path('themes/' . $theme->slug);

        if (File::exists($themeDir)) {
            File::deleteDirectory($themeDir);
        }
    }
}
