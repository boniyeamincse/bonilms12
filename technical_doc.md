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

## Course Management Module

### Overview
The Course Management Module provides instructors with comprehensive tools to create, manage, and monetize online courses. It includes full course lifecycle management from creation to student certification.

### Database Foundation
- **Extended course table**: Added level, subcategory, banner, pricing_type, coupon fields, drip content, discussions, access rules, language, prerequisites, max_students
- **Enhanced enrollment tracking**: Added progress JSON, completion_percentage, grade fields
- **Review moderation**: Added status and moderation_reason fields
- **Certificate system**: Created certificates table with templates and custom data
- **Lecture scheduling**: Added drip_date for content release management

### Navigation & Authentication
- **Dynamic sidebar**: Shows course-specific sub-menus when managing courses
- **Role-based access**: Instructors manage their courses, admins oversee all
- **11 sub-menu items**: Overview, Curriculum, Quizzes & Assignments, Pricing, Drip Content, Discussions, Reviews, Enrollments, Certificates, Earnings, Settings, Publish

### Controller Architecture
- **CourseManagementController**: Full RESTful API with 15+ methods
- **Authorization**: All methods verify instructor owns the course
- **File handling**: Secure uploads for images, attachments, exports
- **Validation**: Comprehensive server-side validation

### Sub-modules Implemented

#### Course Overview Sub-module
- Complete form: Title, description, category, level, status editing
- File uploads: Thumbnail and banner images with live preview
- Category dropdown: Dynamic category selection
- Status management: Draft/Pending/Published workflow

#### Curriculum & Lectures Sub-module
- Section management: Full CRUD operations with modal forms
- Lecture creation: Support for video, text, quiz, assignment types
- File attachments: Multiple file uploads per lecture
- Drag-drop ready: Framework prepared for reordering (can be enhanced)
- Validation: Complete form validation and error handling

#### Pricing & Coupons Sub-module
- Pricing types: Free, one-time payment, subscription options
- Coupon system: Percentage or fixed amount discounts
- Real-time preview: Dynamic price calculation and display
- Smart validation: Ensures valid pricing combinations

#### Enrollments Management Sub-module
- Student dashboard: Complete enrollment list with progress bars
- Progress tracking: Visual completion percentages and grades
- Statistics cards: Total, completed, average progress/grades
- CSV export: Download complete student data with all fields
- Status indicators: Completed vs In Progress with badges

#### Certificates Sub-module
- Auto-generation: One-click certificate creation for completed students
- Eligibility checking: Only allows certificates for 100% completed courses
- Template system: Configurable certificate templates
- PDF download: Certificate download functionality (HTML-based for demo)
- Certificate numbering: Unique certificate numbers
- Custom data: Includes instructor name, completion date, grades

### Key Features

#### Security & Authorization
- Course ownership verification on all operations
- CSRF protection on all forms
- File upload validation and secure storage
- Role-based menu access

#### User Experience
- Responsive design: Mobile-friendly interface
- Dark mode support: Full TailwindCSS dark theme
- Loading states: Progress indicators and disabled buttons
- Error handling: User-friendly error messages
- Real-time updates: Instant UI updates after operations

#### Data Management
- Comprehensive validation: Server and client-side
- File handling: Secure uploads with size/type limits
- Export functionality: CSV export for student data
- Progress tracking: Detailed enrollment analytics

### Technical Architecture

#### Backend (Laravel)
- Models: Course, Enrollment, Certificate with proper relationships
- Controllers: RESTful API design with consistent patterns
- Routes: Organized resource routes with middleware
- Validation: Request validation with custom rules
- File Storage: Laravel's secure file storage system

#### Frontend (React/Inertia)
- Components: Reusable form components and layouts
- State management: React hooks for form handling
- API integration: Axios/fetch for server communication
- UI framework: TailwindCSS with consistent styling
- Modal dialogs: Clean editing interfaces

### Business Functionality

#### For Instructors
- Complete course creation and management workflow
- Student progress monitoring and engagement analytics
- Automated certificate generation and distribution
- Pricing and discount management
- Content organization with sections and lectures

#### For Students
- Certificate earning upon course completion
- Progress tracking and grade visibility
- Automated certificate delivery

#### For Admins
- Oversight of all courses and certificates
- Moderation tools for reviews and content
- System-wide analytics and reporting

### Production Ready Features
- Scalable architecture for adding new features
- Secure file handling for multimedia content
- Performance optimized queries with eager loading
- Mobile responsive design for all devices
- Role-based permissions for multi-user access
- Export capabilities for reporting and compliance
- Certificate automation for course completion workflows

## Future Enhancements

### Potential Features
- Real-time notifications with WebSockets
- Advanced analytics dashboard
- Mobile app development
- Multi-language support
- Integration APIs (Zoom, Google Classroom)

### Performance Improvements
- Redis clustering
- CDN integration
- Database read replicas
- Horizontal scaling setup

This documentation provides a comprehensive overview of the BONI LMS system architecture, features, and development practices.
