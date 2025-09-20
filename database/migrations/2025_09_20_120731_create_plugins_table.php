<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plugins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('version');
            $table->string('description')->nullable();
            $table->string('author')->nullable();
            $table->string('author_url')->nullable();
            $table->string('plugin_uri')->nullable();
            $table->string('license')->nullable();
            $table->string('requires')->nullable(); // Minimum PHP version
            $table->string('tested')->nullable(); // Tested up to
            $table->string('requires_php')->nullable();
            $table->json('tags')->nullable();
            $table->json('screenshots')->nullable();
            $table->boolean('is_active')->default(false);
            $table->string('status')->default('installed'); // installed, active, inactive, error
            $table->json('settings')->nullable(); // Plugin configuration
            $table->json('capabilities')->nullable(); // What the plugin can do
            $table->text('changelog')->nullable();
            $table->timestamp('installed_at')->nullable();
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();

            $table->index(['is_active', 'status']);
        });

        // Create themes table
        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('version');
            $table->string('description')->nullable();
            $table->string('author')->nullable();
            $table->string('author_url')->nullable();
            $table->string('theme_uri')->nullable();
            $table->string('license')->nullable();
            $table->json('tags')->nullable();
            $table->json('screenshots')->nullable();
            $table->boolean('is_active')->default(false);
            $table->string('status')->default('installed'); // installed, active, inactive
            $table->json('settings')->nullable(); // Theme configuration
            $table->json('customizer_options')->nullable(); // Theme customizer settings
            $table->text('changelog')->nullable();
            $table->timestamp('installed_at')->nullable();
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();

            $table->index(['is_active', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plugins');
    }
};
