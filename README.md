<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Boni LMS

Boni Security LMS is a powerful and easy-to-use Learning Management System built on Laravel v12. It is designed for schools, coaching centers, individual instructors, and academies to create, manage, and sell courses online without coding.

Boni LMS provides the following features:

- Intuitive Drag & Drop Course Builder
- Unlimited Categories & Subcategories
- Smart Installation Wizard
- Drip Content (scheduled release of lessons)
- Course Preview before purchase
- Social Login (Google, Facebook, LinkedIn)
- Excellent Quiz & Assignment System
- Course Search and Filter with Advanced Options
- Instructor Dashboard with Earnings & Reports
- Wishlist (save favorite courses)
- File Attachments per lecture
- Modern Lecture Page with Video/Text/Slides
- Ratings & Reviews System ⭐
- Blog Module (SEO ready)
- Withdraw Earnings Module for Instructors
- Student Discussions & Forums ⁉
- Media Manager for Admin & Instructors
- Dynamic Pages (CMS-style custom pages)
- Cookie Notice for GDPR compliance
- Student Course Progress Tracking
- High Performance & Optimized for heavy data
- Multi-Instructor Support (co-teaching)

Boni LMS is accessible, powerful, and provides tools required for large, robust online academies.

## Installation

### Prerequisites
- PHP 8.1 or higher
- Node.js & npm
- Composer
- MySQL or PostgreSQL database

### Setup Instructions

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/bonilms.git
cd bonilms
```

2. **Install PHP dependencies:**
```bash
composer install
```

3. **Install Node.js dependencies:**
```bash
npm install
```

4. **Environment Setup:**
```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials and other settings:
```env
APP_NAME="BoniLMS"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bonilms
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. **Generate application key:**
```bash
php artisan key:generate
```

6. **Run database migrations:**
```bash
php artisan migrate
```

7. **Seed the database:**
```bash
php artisan db:seed
```

8. **Build assets:**
```bash
npm run build
```

9. **Start the development server:**
```bash
php artisan serve
```

Visit `http://localhost:8000` to access your BoniLMS application.

## Supported Languages

BoniLMS currently supports two languages:
- **English (EN)** - Default language
- **Bangla (BN)** - Bengali language support

The language switcher is available in the header navigation for easy switching between languages.

## User Roles & Authentication

BoniLMS includes three user roles with different permissions. The following table shows the default user accounts available for testing:

| User Type | Email | Password | Role ID | Capabilities |
|-----------|-------|----------|---------|--------------|
| **Admin** | `admin@bonilms.com` | `password` | 1 | Full system access, user management, course management, analytics |
| **Instructor** | `instructor@bonilms.com` | `password` | 2 | Course creation, content upload, student management, earnings |
| **Student** | `student@bonilms.com` | `password` | 3 | Course enrollment, learning progress, reviews, quizzes |

### User Roles Table

| Role Name | Role ID | Description | Database Table: `roles` |
|-----------|---------|-------------|-------------------------|
| **admin** | 1 | Administrator with full access | `roles` table stores role definitions |
| **instructor** | 2 | Course instructor and content creator | `users.role_id` references this |
| **student** | 3 | Course learner and student | Role-based access control |

### Database Users Table Structure

The `users` table includes role-based authentication:

```sql
users:
- id (Primary Key)
- name (User's full name)
- email (Unique email address)
- password (Hashed password)
- role_id (Foreign Key → roles.id)
- email_verified_at (Email verification timestamp)
- created_at, updated_at (Timestamps)
```

### Sample Users Created by Seeders

| Name | Email | Role | Status |
|------|-------|------|--------|
| BoniLMS Admin | admin@bonilms.com | Admin | Active |
| John Instructor | instructor@bonilms.com | Instructor | Active |
| Sarah Student | student@bonilms.com | Student | Active |
| Dr. Maria Rodriguez | maria@instructor.com | Instructor | Active |
| Prof. Ahmed Hassan | ahmed@instructor.com | Instructor | Active |
| Lisa Chen | lisa@instructor.com | Instructor | Active |
| Alex Johnson | alex@student.com | Student | Active |
| Emma Wilson | emma@student.com | Student | Active |
| Carlos Martinez | carlos@student.com | Student | Active |
| Priya Sharma | priya@student.com | Student | Active |
| David Lee | david@student.com | Student | Active |

### Creating Additional Users

To create users with specific roles, use the following commands:

**Create Admin User:**
```bash
php artisan tinker
```
```php
\App\Models\User::create([
    'name' => 'Your Name',
    'email' => 'your@email.com',
    'password' => bcrypt('yourpassword'),
    'email_verified_at' => now(),
])->assignRole('admin');
```

**Create Instructor User:**
```php
\App\Models\User::create([
    'name' => 'Instructor Name',
    'email' => 'instructor@email.com',
    'password' => bcrypt('password'),
    'email_verified_at' => now(),
])->assignRole('instructor');
```

**Create Student User:**
```php
\App\Models\User::create([
    'name' => 'Student Name',
    'email' => 'student@email.com',
    'password' => bcrypt('password'),
    'email_verified_at' => now(),
])->assignRole('student');
```

## Learning Boni LMS

Boni LMS has comprehensive documentation and tutorials to get started quickly.

For detailed guides, visit the [Boni LMS Documentation](https://bonilms.com/docs).

You may also explore the [Installation Guide](https://bonilms.com/install), where you will be guided through setting up a modern Boni LMS instance.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help with Laravel-specific tutorials.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Boni LMS project! The contribution guide can be found in the [Boni LMS Documentation](https://bonilms.com/docs/contributions).

## Code of Conduct

In order to ensure that the Boni LMS community is welcoming to all, please review and abide by the [Code of Conduct](https://bonilms.com/docs/code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Boni LMS, please send an e-mail to the development team via [security@bonilms.com](mailto:security@bonilms.com). All security vulnerabilities will be promptly addressed.

## License

Boni LMS is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).