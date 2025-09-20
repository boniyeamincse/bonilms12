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
        Schema::table('courses', function (Blueprint $table) {
            $table->string('subcategory')->nullable();
            $table->enum('level', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->string('banner')->nullable();
            $table->enum('pricing_type', ['free', 'paid', 'subscription'])->default('paid');
            $table->string('coupon_code')->nullable();
            $table->enum('coupon_discount_type', ['percentage', 'fixed'])->nullable();
            $table->decimal('coupon_discount_value', 8, 2)->nullable();
            $table->boolean('drip_enabled')->default(false);
            $table->boolean('sequential_unlock')->default(false);
            $table->boolean('discussions_enabled')->default(true);
            $table->enum('access_type', ['public', 'private', 'unlisted'])->default('public');
            $table->string('language')->default('en');
            $table->json('prerequisites')->nullable();
            $table->integer('max_students')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn([
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
                'max_students'
            ]);
        });
    }
};
