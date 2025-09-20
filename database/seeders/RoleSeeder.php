<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Role::firstOrCreate(['name' => 'admin'], ['description' => 'Administrator with full access']);
        \App\Models\Role::firstOrCreate(['name' => 'instructor'], ['description' => 'Course instructor']);
        \App\Models\Role::firstOrCreate(['name' => 'student'], ['description' => 'Student user']);
    }
}
