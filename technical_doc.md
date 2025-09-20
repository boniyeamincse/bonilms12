# BONI LMS - Technical Documentation

## Overview
BONI LMS is a comprehensive Learning Management System built with Laravel 11 and React (Inertia.js). It provides a platform for instructors to create and sell courses, and for students to enroll and learn.

## Architecture

### Backend
- **Framework**: Laravel 11
- **Database**: SQLite/MySQL/PostgreSQL
- **Queue System**: Database queues
- **Caching**: File/Redis cache with tagged caching
- **Authentication**: Laravel Sanctum with role-based access control
- **File Storage**: Local/S3 storage

### Frontend
- **Framework**: React with Inertia.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React hooks + Inertia props

## Core Features

### 1. Settings Management
- **Location**: `app/Http/Controllers/Admin/SettingsController.php`
- **Features**:
  - Site configuration (name, description, URL)
  - Email settings (SMTP configuration)
  - Payment gateway settings (Stripe, PayPal)
  - S3 storage configuration
  - Cache settings (driver, TTL)
- **Caching**: Settings are cached for 1 hour using tagged cache
- **Frontend**: Tabbed interface with form validation

### 2. Performance Optimizations
- **Caching**: Model-level caching for frequently accessed data
- **Pagination**: All admin lists use pagination (10-20 items per page)
- **Background Jobs**: Email notifications dispatched asynchronously
- **Database Optimization**: Proper indexing and eager loading

### 3. Accessibility Features (WCAG AA)
- **Skip Links**: Navigation shortcuts for screen readers
- **ARIA Labels**: Proper labeling of interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks

### 4. Search Functionality
- **Global Search**: Topbar search redirects to appropriate admin pages
- **Backend Search**: Database queries with LIKE operators
- **Context-Aware**: Different search behavior based on user role

### 5. UI Components
- **Empty States**: Contextual messages when no data exists
- **Skeleton Loaders**: Loading states for better UX
- **Toast Notifications**: Non-intrusive feedback messages
- **Responsive Design**: Mobile-first approach

### 6. Testing
- **Feature Tests**: Comprehensive admin feature testing
- **Factories**: Model factories for test data generation
- **Assertions**: Proper HTTP and database assertions

## Database Schema

### Core Tables
- `users` - User accounts with role relationships
- `courses` - Course content and metadata
- `enrollments` - Student-course relationships
- `payments` - Transaction records
- `settings` - Configuration key-value pairs
- `categories` - Course categorization
- `reviews` - Course ratings and feedback

### Key Relationships
- User belongs to Role (admin/instructor/student)
- Course belongs to User (instructor) and Category
- Enrollment belongs to User and Course
- Payment belongs to User and Course

## API Endpoints

### Admin Settings
```
GET    /admin/settings              - View settings page
PUT    /admin/settings              - Update all settings
GET    /admin/settings/group/{group} - Get settings by group
PUT    /admin/settings/group/{group} - Update settings by group
POST   /admin/settings/initialize    - Initialize default settings
```

### Admin Management
```
GET    /admin/users                 - List users (with search)
GET    /admin/courses               - List courses (with search)
POST   /admin/courses/{id}/approve  - Approve course
POST   /admin/courses/{id}/reject   - Reject course
POST   /admin/users/{id}/block      - Block user
POST   /admin/users/{id}/unblock    - Unblock user
```

## Key Components

### Backend Components
- `SettingsController` - Settings management
- `AdminController` - Admin dashboard and operations
- `Setting` model - Cached configuration management
- `SendCourseApprovedEmail` job - Async email notifications

### Frontend Components
- `AuthenticatedLayout` - Main layout with accessibility features
- `Settings/Index` - Settings management interface
- `EmptyState` - Reusable empty state component
- `SkeletonLoader` - Loading state components
- `Toast` - Notification system

## Performance Considerations

### Caching Strategy
- **Settings**: 1-hour cache with automatic invalidation on updates
- **Course Lists**: Tagged caching for featured/popular courses
- **Database Queries**: Proper indexing and eager loading

### Queue Configuration
- **Driver**: Database (configurable to Redis/SQS)
- **Jobs**: Email notifications, heavy processing tasks
- **Monitoring**: Failed job tracking

### Optimization Techniques
- **Pagination**: Prevents large dataset loading
- **Lazy Loading**: Relationships loaded on demand
- **Asset Optimization**: Vite bundling with code splitting

## Security Features

### Authentication & Authorization
- **Middleware**: Role-based access control
- **CSRF Protection**: Laravel's built-in CSRF tokens
- **Input Validation**: Comprehensive request validation

### Data Protection
- **Mass Assignment Protection**: Fillable attributes
- **SQL Injection Prevention**: Eloquent ORM
- **XSS Protection**: Blade templating and React sanitization

## Development Guidelines

### Code Style
- **PHP**: PSR-12 standards
- **JavaScript**: ESLint configuration
- **Commits**: Conventional commit messages

### Testing
- **Coverage**: Feature tests for critical paths
- **Factories**: Consistent test data generation
- **Assertions**: Meaningful test assertions

### Deployment
- **Environment**: Separate configs for dev/staging/prod
- **Migrations**: Database versioning
- **Assets**: Compiled and versioned

## Future Enhancements

### Potential Features
- Real-time notifications with WebSockets
- Advanced analytics dashboard
- Mobile app development
- Multi-language support
- Advanced course builder
- Integration APIs (Zoom, Google Classroom)

### Performance Improvements
- Redis clustering
- CDN integration
- Database read replicas
- Horizontal scaling setup

This documentation provides a comprehensive overview of the BONI LMS system architecture, features, and development practices.
