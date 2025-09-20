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
        Schema::create('withdrawals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 8, 2);
            $table->enum('method', ['paypal', 'bank_transfer', 'stripe'])->default('paypal');
            $table->enum('status', ['pending', 'approved', 'declined', 'completed'])->default('pending');
            $table->text('notes')->nullable();
            $table->json('bank_details')->nullable(); // for bank transfers
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withdrawals');
    }
};
