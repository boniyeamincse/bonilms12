<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Withdrawal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $user;
    protected $course;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $this->admin = User::factory()->create([
            'role_id' => 1,
        ]);

        // Create regular user
        $this->user = User::factory()->create([
            'role_id' => 3, // student
        ]);

        // Create instructor
        $instructor = User::factory()->create([
            'role_id' => 2, // instructor
        ]);

        // Create course
        $this->course = Course::factory()->create([
            'instructor_id' => $instructor->id,
            'status' => 'pending'
        ]);
    }

    public function test_admin_can_access_dashboard()
    {
        $response = $this->actingAs($this->admin)
                         ->get('/admin/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Dashboard/Index')
            ->has('stats')
        );
    }

    public function test_admin_can_view_users_with_search()
    {
        $response = $this->actingAs($this->admin)
                         ->get('/admin/users?search=' . $this->user->name);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Users/Index')
            ->has('users')
        );
    }

    public function test_admin_can_view_courses_with_search()
    {
        $response = $this->actingAs($this->admin)
                         ->get('/admin/courses?search=' . $this->course->title);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Courses/Index')
            ->has('courses')
        );
    }

    public function test_admin_can_approve_course()
    {
        $response = $this->actingAs($this->admin)
                         ->post("/admin/courses/{$this->course->id}/approve");

        $response->assertRedirect();
        $this->assertDatabaseHas('courses', [
            'id' => $this->course->id,
            'status' => 'published'
        ]);
    }

    public function test_admin_can_reject_course()
    {
        $response = $this->actingAs($this->admin)
                         ->post("/admin/courses/{$this->course->id}/reject");

        $response->assertRedirect();
        $this->assertDatabaseHas('courses', [
            'id' => $this->course->id,
            'status' => 'rejected'
        ]);
    }

    public function test_admin_can_block_user()
    {
        $response = $this->actingAs($this->admin)
                         ->post("/admin/users/{$this->user->id}/block");

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'blocked_at' => now()
        ]);
    }

    public function test_admin_can_unblock_user()
    {
        // First block the user
        $this->user->update(['blocked_at' => now()]);

        $response = $this->actingAs($this->admin)
                         ->post("/admin/users/{$this->user->id}/unblock");

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'blocked_at' => null
        ]);
    }

    public function test_admin_can_view_payments()
    {
        Payment::factory()->create();

        $response = $this->actingAs($this->admin)
                         ->get('/admin/payments');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Payments/Index')
            ->has('payments')
        );
    }

    public function test_admin_can_view_withdrawals()
    {
        Withdrawal::factory()->create();

        $response = $this->actingAs($this->admin)
                         ->get('/admin/withdrawals');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Withdrawals/Index')
            ->has('withdrawals')
        );
    }

    public function test_admin_can_approve_withdrawal()
    {
        $withdrawal = Withdrawal::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($this->admin)
                         ->post("/admin/withdrawals/{$withdrawal->id}/approve");

        $response->assertRedirect();
        $this->assertDatabaseHas('withdrawals', [
            'id' => $withdrawal->id,
            'status' => 'approved',
            'processed_at' => now()
        ]);
    }

    public function test_admin_can_decline_withdrawal()
    {
        $withdrawal = Withdrawal::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($this->admin)
                         ->post("/admin/withdrawals/{$withdrawal->id}/decline");

        $response->assertRedirect();
        $this->assertDatabaseHas('withdrawals', [
            'id' => $withdrawal->id,
            'status' => 'declined'
        ]);
    }

    public function test_admin_can_view_course_reviews_queue()
    {
        $response = $this->actingAs($this->admin)
                         ->get('/admin/queues/course-reviews');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Queues/CourseReviews/Index')
            ->has('courses')
        );
    }

    public function test_admin_can_view_withdrawals_queue()
    {
        $response = $this->actingAs($this->admin)
                         ->get('/admin/queues/withdrawals');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Queues/Withdrawals/Index')
            ->has('withdrawals')
        );
    }
}