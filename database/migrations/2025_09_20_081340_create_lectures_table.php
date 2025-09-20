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
        Schema::create('lectures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->enum('type', ['video', 'text', 'quiz', 'assignment'])->default('text');
            $table->text('content')->nullable(); // for text or url
            $table->integer('order')->default(0);
            $table->integer('duration')->nullable(); // in minutes
            $table->json('attachments')->nullable(); // array of file urls
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lectures');
    }
};
