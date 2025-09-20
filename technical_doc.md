# Boni Security LMS -- Technical Documentation

## Overview

Boni Security LMS is a powerful and easy-to-use Learning Management
System built on **Laravel v12**.\
It is designed for schools, coaching centers, individual instructors,
and academies to create, manage, and sell courses online without coding.

This documentation provides the technical requirements, modules, and
features for developers to understand and work with the system.

------------------------------------------------------------------------

## Technical Requirements

### Backend

-   **Framework**: Laravel v12 (Latest stable version)
-   **Language**: PHP 8.3+
-   **Database**: MySQL 8 / MariaDB 10.6+
-   **Caching**: Redis (optional but recommended for performance)
-   **Storage**: Local & Amazon S3 integration for file uploads
-   **Payment Gateways**: Stripe, PayPal, Bank Transfer, Offline
    Payments

### Frontend

-   **SPA Framework**: Vue.js 3 or React (integrated with Laravel)
-   **Styling**: TailwindCSS + Bootstrap 5 (hybrid usage)
-   **Authentication**: Laravel Breeze / Jetstream with Social Login
    (Google, Facebook, LinkedIn)
-   **Responsive**: Mobile-first UI/UX design

### Server Requirements

-   **Web Server**: Apache 2.4 / Nginx
-   **PHP Extensions**: BCMath, Ctype, Fileinfo, JSON, Mbstring,
    OpenSSL, PDO, Tokenizer, XML, GD, Zip
-   **Operating System**: Linux (Ubuntu 22.04 LTS recommended)
-   **Minimum Hardware**: 4 vCPU, 8 GB RAM, 100 GB SSD

------------------------------------------------------------------------

## Core Features

-   Intuitive **Drag & Drop Course Builder**
-   Unlimited Categories & Subcategories
-   **Smart Installation Wizard**
-   **Drip Content** (scheduled release of lessons)
-   Course Preview before purchase
-   **Social Login** (Google, Facebook, LinkedIn)
-   Excellent Quiz & Assignment System
-   Course Search and Filter with Advanced Options
-   Instructor Dashboard with **Earnings & Reports**
-   Wishlist (save favorite courses)
-   File Attachments per lecture
-   Modern Lecture Page with Video/Text/Slides
-   Ratings & Reviews System ⭐
-   Blog Module (SEO ready)
-   Withdraw Earnings Module for Instructors
-   Student Discussions & Forums ⁉
-   Media Manager for Admin & Instructors
-   Dynamic Pages (CMS-style custom pages)
-   Cookie Notice for GDPR compliance
-   Student Course Progress Tracking
-   High Performance & Optimized for heavy data
-   Multi-Instructor Support (co-teaching)

------------------------------------------------------------------------

## Payment Integration

-   **Stripe Payment Gateway**
-   **PayPal Integration**
-   **Bank Transfer**
-   **Offline Payment Support**

------------------------------------------------------------------------

## User Roles

### Admin

-   Manage the entire LMS platform
-   Approve/Block courses and users
-   Approve/Decline instructor withdrawals
-   Install/Uninstall plugins and themes
-   Manage categories and media files
-   Track global statistics and reports

### Instructor

-   Create courses, sections, lessons, and quizzes
-   Set free or paid course prices
-   Publish courses (with admin approval)
-   Earn money from student enrollments
-   Withdraw earnings
-   Track student progress & performance

### Student

-   Create account and enroll in courses
-   Browse and purchase free/paid courses
-   Start learning immediately after enrollment
-   Submit assignments, quizzes, and tasks
-   Get certification after course completion

------------------------------------------------------------------------

## Advanced Features

-   **Drip Content Scheduler**: Release course modules step-by-step
-   **Attachments**: Upload and attach files to lessons
-   **Assignments**: Allow instructors to assign and evaluate tasks
-   **Student Progress Reports**
-   **Smart Ratings and Reviews System**
-   **Personalized Media Manager**: Centralized file management
-   **Heavy Data Support**: Optimized database queries for thousands of
    courses and users

------------------------------------------------------------------------

## Developer Notes

-   Modular structure for future scalability
-   API-ready for mobile app integration
-   Optimized for **SEO and Performance**
-   Uses **Queue System** for email, notifications, and background jobs
-   Laravel Horizon for monitoring queues

------------------------------------------------------------------------

## File Structure (Simplified)

    /boni-security-lms
    │── app
    │   ├── Models
    │   ├── Http
    │   ├── Providers
    │── bootstrap
    │── config
    │── database
    │── public
    │── resources
    │   ├── js (Vue/React components)
    │   ├── sass (Tailwind + Bootstrap)
    │   ├── views (Blade templates)
    │── routes
    │   ├── web.php
    │   ├── api.php
    │── storage
    │── tests
    │── vendor

------------------------------------------------------------------------

## Conclusion

Boni Security LMS is a **full-featured, scalable, and secure** Learning
Management System built on Laravel.\
It provides all the modules and integrations required to run a
professional online academy similar to Udemy or LinkedIn Learning.

------------------------------------------------------------------------
