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
    $user = auth()->user();
    \Log::info('Dashboard accessed by user', [
        'user_id' => $user->id,
        'user_name' => $user->name,
        'user_email' => $user->email,
        'role_id' => $user->role_id,
        'role_name' => $user->role ? $user->role->name : 'no role'
    ]);

    return Inertia::render('Dashboard', [
        'user' => $user->load('role')
    ]);
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // Users management
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::post('/users/{user}/block', [AdminController::class, 'blockUser'])->name('admin.users.block');
    Route::post('/users/{user}/unblock', [AdminController::class, 'unblockUser'])->name('admin.users.unblock');

    // Courses management
    Route::get('/courses', [AdminController::class, 'courses'])->name('admin.courses');
    Route::post('/courses/{course}/approve', [AdminController::class, 'approveCourse'])->name('admin.courses.approve');
    Route::post('/courses/{course}/reject', [AdminController::class, 'rejectCourse'])->name('admin.courses.reject');

    // Categories
    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class, ['as' => 'admin']);

    // Payments
    Route::get('/payments', [AdminController::class, 'payments'])->name('admin.payments');
    Route::post('/payments/{payment}/refund', [AdminController::class, 'refundPayment'])->name('admin.payments.refund');

    // Withdrawals
    Route::get('/withdrawals', [AdminController::class, 'withdrawals'])->name('admin.withdrawals');
    Route::post('/withdrawals/{withdrawal}/approve', [AdminController::class, 'approveWithdrawal'])->name('admin.withdrawals.approve');
    Route::post('/withdrawals/{withdrawal}/decline', [AdminController::class, 'declineWithdrawal'])->name('admin.withdrawals.decline');

    // Queues
    Route::get('/queues/course-reviews', [AdminController::class, 'courseReviewsQueue'])->name('admin.queues.course-reviews');
    Route::get('/queues/withdrawals', [AdminController::class, 'withdrawalsQueue'])->name('admin.queues.withdrawals');

    // Media Manager
    Route::resource('media', \App\Http\Controllers\Admin\MediaController::class, ['as' => 'admin']);
    Route::post('/media/bulk-delete', [\App\Http\Controllers\Admin\MediaController::class, 'bulkDelete'])->name('admin.media.bulk-delete');
    Route::get('/media/search', [\App\Http\Controllers\Admin\MediaController::class, 'search'])->name('admin.media.search');
    Route::get('/media/folders', [\App\Http\Controllers\Admin\MediaController::class, 'folders'])->name('admin.media.folders');
    Route::get('/media/collections', [\App\Http\Controllers\Admin\MediaController::class, 'collections'])->name('admin.media.collections');
    Route::get('/media/{media}/download', [\App\Http\Controllers\Admin\MediaController::class, 'download'])->name('admin.media.download');

    // Categories Management
    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class, ['as' => 'admin']);
    Route::post('/categories/update-order', [\App\Http\Controllers\Admin\CategoryController::class, 'updateOrder'])->name('admin.categories.update-order');
    Route::post('/categories/bulk-delete', [\App\Http\Controllers\Admin\CategoryController::class, 'bulkDelete'])->name('admin.categories.bulk-delete');
    Route::post('/categories/{category}/toggle-active', [\App\Http\Controllers\Admin\CategoryController::class, 'toggleActive'])->name('admin.categories.toggle-active');
    Route::get('/categories-tree', [\App\Http\Controllers\Admin\CategoryController::class, 'tree'])->name('admin.categories.tree');

    // CMS Module - Pages, Blog, Menus
    Route::prefix('cms')->group(function () {
        // Pages
        Route::get('/pages', [\App\Http\Controllers\Admin\CmsController::class, 'pages'])->name('admin.cms.pages');
        Route::post('/pages', [\App\Http\Controllers\Admin\CmsController::class, 'pagesStore'])->name('admin.cms.pages.store');
        Route::put('/pages/{page}', [\App\Http\Controllers\Admin\CmsController::class, 'pagesUpdate'])->name('admin.cms.pages.update');
        Route::delete('/pages/{page}', [\App\Http\Controllers\Admin\CmsController::class, 'pagesDestroy'])->name('admin.cms.pages.destroy');

        // Blog Posts
        Route::get('/blog', [\App\Http\Controllers\Admin\CmsController::class, 'blogPosts'])->name('admin.cms.blog');
        Route::post('/blog', [\App\Http\Controllers\Admin\CmsController::class, 'blogPostsStore'])->name('admin.cms.blog.store');
        Route::put('/blog/{blogPost}', [\App\Http\Controllers\Admin\CmsController::class, 'blogPostsUpdate'])->name('admin.cms.blog.update');
        Route::delete('/blog/{blogPost}', [\App\Http\Controllers\Admin\CmsController::class, 'blogPostsDestroy'])->name('admin.cms.blog.destroy');

        // Menus
        Route::get('/menus', [\App\Http\Controllers\Admin\CmsController::class, 'menus'])->name('admin.cms.menus');
        Route::post('/menus', [\App\Http\Controllers\Admin\CmsController::class, 'menusStore'])->name('admin.cms.menus.store');
        Route::put('/menus/{menu}', [\App\Http\Controllers\Admin\CmsController::class, 'menusUpdate'])->name('admin.cms.menus.update');
        Route::delete('/menus/{menu}', [\App\Http\Controllers\Admin\CmsController::class, 'menusDestroy'])->name('admin.cms.menus.destroy');

        // Menu Items
        Route::post('/menus/{menu}/items', [\App\Http\Controllers\Admin\CmsController::class, 'menuItemsStore'])->name('admin.cms.menus.items.store');
        Route::put('/menus/{menu}/items/reorder', [\App\Http\Controllers\Admin\CmsController::class, 'menuItemsReorder'])->name('admin.cms.menus.items.reorder');
        Route::delete('/menus/{menu}/items/{item}', [\App\Http\Controllers\Admin\CmsController::class, 'menuItemsDestroy'])->name('admin.cms.menus.items.destroy');
    
        // Extensions Management (Plugins & Themes)
        Route::prefix('extensions')->group(function () {
            // Plugins
            Route::get('/plugins', [\App\Http\Controllers\Admin\ExtensionsController::class, 'plugins'])->name('admin.extensions.plugins');
            Route::post('/plugins/upload', [\App\Http\Controllers\Admin\ExtensionsController::class, 'pluginsUpload'])->name('admin.extensions.plugins.upload');
            Route::post('/plugins/{plugin}/activate', [\App\Http\Controllers\Admin\ExtensionsController::class, 'pluginsActivate'])->name('admin.extensions.plugins.activate');
            Route::post('/plugins/{plugin}/deactivate', [\App\Http\Controllers\Admin\ExtensionsController::class, 'pluginsDeactivate'])->name('admin.extensions.plugins.deactivate');
            Route::delete('/plugins/{plugin}', [\App\Http\Controllers\Admin\ExtensionsController::class, 'pluginsDelete'])->name('admin.extensions.plugins.delete');
            Route::get('/plugins/{plugin}/settings', [\App\Http\Controllers\Admin\ExtensionsController::class, 'pluginsSettings'])->name('admin.extensions.plugins.settings');
            Route::put('/plugins/{plugin}/settings', [\App\Http\Controllers\Admin\ExtensionsController::class, 'pluginsUpdateSettings'])->name('admin.extensions.plugins.settings.update');
    
            // Themes
            Route::get('/themes', [\App\Http\Controllers\Admin\ExtensionsController::class, 'themes'])->name('admin.extensions.themes');
            Route::post('/themes/upload', [\App\Http\Controllers\Admin\ExtensionsController::class, 'themesUpload'])->name('admin.extensions.themes.upload');
            Route::post('/themes/{theme}/activate', [\App\Http\Controllers\Admin\ExtensionsController::class, 'themesActivate'])->name('admin.extensions.themes.activate');
            Route::delete('/themes/{theme}', [\App\Http\Controllers\Admin\ExtensionsController::class, 'themesDelete'])->name('admin.extensions.themes.delete');
            Route::get('/themes/{theme}/customizer', [\App\Http\Controllers\Admin\ExtensionsController::class, 'themesCustomizer'])->name('admin.extensions.themes.customizer');
            Route::put('/themes/{theme}/customizer', [\App\Http\Controllers\Admin\ExtensionsController::class, 'themesUpdateCustomizer'])->name('admin.extensions.themes.customizer.update');
            Route::get('/themes/{theme}/preview', [\App\Http\Controllers\Admin\ExtensionsController::class, 'themesPreview'])->name('admin.extensions.themes.preview');
        });
    });

    // Settings
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('admin.settings');
    Route::put('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('admin.settings.update');
    Route::get('/settings/group/{group}', [\App\Http\Controllers\Admin\SettingsController::class, 'getGroup'])->name('admin.settings.group');
    Route::put('/settings/group/{group}', [\App\Http\Controllers\Admin\SettingsController::class, 'updateGroup'])->name('admin.settings.group.update');
    Route::post('/settings/initialize', [\App\Http\Controllers\Admin\SettingsController::class, 'initializeDefaults'])->name('admin.settings.initialize');
});

// Dashboard API routes with role protection
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/api/dashboard/admin/metrics', [AdminDashboardController::class, 'metrics']);
    Route::get('/api/admin/courses', [AdminDashboardController::class, 'getCourses']);
    Route::post('/api/admin/courses/{course}/approve', [AdminDashboardController::class, 'approveCourse']);
    Route::post('/api/admin/courses/{course}/reject', [AdminDashboardController::class, 'rejectCourse']);
    Route::get('/api/admin/payments', [AdminDashboardController::class, 'getPayments']);
    Route::get('/api/admin/withdrawals', [AdminDashboardController::class, 'getWithdrawals']);
    Route::post('/api/admin/withdrawals/{withdrawal}/approve', [AdminDashboardController::class, 'approveWithdrawal']);
    Route::post('/api/admin/withdrawals/{withdrawal}/decline', [AdminDashboardController::class, 'declineWithdrawal']);
});

Route::middleware(['auth', 'role:instructor'])->group(function () {
    Route::get('/api/dashboard/instructor/metrics', [InstructorDashboardController::class, 'metrics']);
});

Route::middleware(['auth', 'role:student'])->group(function () {
    Route::get('/api/dashboard/student/metrics', [StudentDashboardController::class, 'metrics']);
});

// Navigation menu API route
Route::middleware(['auth'])->group(function () {
    Route::get('/api/navigation/menu', [\App\Http\Controllers\NavigationController::class, 'getNavigationMenu']);
});

require __DIR__.'/auth.php';
