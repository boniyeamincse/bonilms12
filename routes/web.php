<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\InstructorDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Dashboard API routes with role protection
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/api/dashboard/admin/metrics', [AdminDashboardController::class, 'metrics']);
});

Route::middleware(['auth', 'role:instructor'])->group(function () {
    Route::get('/api/dashboard/instructor/metrics', [InstructorDashboardController::class, 'metrics']);
});

Route::middleware(['auth', 'role:student'])->group(function () {
    Route::get('/api/dashboard/student/metrics', [StudentDashboardController::class, 'metrics']);
});

require __DIR__.'/auth.php';
