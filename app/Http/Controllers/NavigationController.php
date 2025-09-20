<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NavigationController extends Controller
{
    public function getNavigationMenu(Request $request)
    {
        $user = Auth::user();
        $userRole = $user->role->name ?? 'student';

        // For now, we'll use role-based menu locations
        // In a more advanced system, you might have specific menu slugs per role
        $menuLocation = $userRole . '_navigation';

        $menu = Menu::active()
            ->byLocation($menuLocation)
            ->with(['items' => function($query) {
                $query->with('children')
                    ->topLevel()
                    ->ordered();
            }])
            ->first();

        $navigationItems = [];

        if ($menu) {
            // Build hierarchical menu structure
            $navigationItems = $this->buildMenuItems($menu->items);
        } else {
            // Fallback to hardcoded menus if no database menu exists
            $navigationItems = $this->getFallbackNavigation($userRole);
        }

        return response()->json([
            'navigation' => $navigationItems,
            'user_role' => $userRole
        ]);
    }

    private function buildMenuItems($items)
    {
        $menuData = [];

        foreach ($items as $item) {
            $menuItem = [
                'id' => $item->id,
                'title' => $item->title,
                'url' => $item->full_url,
                'icon' => $this->getIconForMenuItem($item),
                'has_children' => $item->children->count() > 0,
                'children' => $item->children->count() > 0 ? $this->buildMenuItems($item->children) : [],
                'is_active' => $item->is_active,
                'css_class' => $item->css_class,
            ];

            $menuData[] = $menuItem;
        }

        return $menuData;
    }

    private function getIconForMenuItem($item)
    {
        // Map menu item titles to icons
        $iconMap = [
            'Dashboard' => 'BarChart3',
            'Users' => 'Users',
            'Courses' => 'BookOpen',
            'My Courses' => 'BookOpen',
            'Students' => 'GraduationCap',
            'Earnings' => 'DollarSign',
            'Analytics' => 'PieChart',
            'Progress' => 'TrendingUp',
            'Certificates' => 'Award',
            'Wishlist' => 'Heart',
            'Payments' => 'CreditCard',
            'Reports' => 'TrendingUp',
            'Settings' => 'Settings',
        ];

        return $iconMap[$item->title] ?? 'Circle';
    }

    private function getFallbackNavigation($role)
    {
        $commonItems = [
            [
                'id' => 'dashboard',
                'title' => 'Dashboard',
                'url' => '/dashboard',
                'icon' => 'BarChart3',
                'has_children' => false,
                'children' => [],
                'is_active' => true,
                'css_class' => '',
            ]
        ];

        $roleSpecificItems = [
            'admin' => [
                [
                    'id' => 'users',
                    'title' => 'Users',
                    'url' => '/admin/users',
                    'icon' => 'Users',
                    'has_children' => true,
                    'children' => [
                        [
                            'id' => 'all_users',
                            'title' => 'All Users',
                            'url' => '/admin/users',
                            'icon' => 'Users',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                        [
                            'id' => 'user_roles',
                            'title' => 'User Roles',
                            'url' => '/admin/user-roles',
                            'icon' => 'Shield',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                    ],
                    'is_active' => true,
                    'css_class' => '',
                ],
                [
                    'id' => 'courses',
                    'title' => 'Courses',
                    'url' => '/admin/courses',
                    'icon' => 'BookOpen',
                    'has_children' => true,
                    'children' => [
                        [
                            'id' => 'all_courses',
                            'title' => 'All Courses',
                            'url' => '/admin/courses',
                            'icon' => 'BookOpen',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                        [
                            'id' => 'pending_courses',
                            'title' => 'Pending Approval',
                            'url' => '/admin/courses?status=pending',
                            'icon' => 'Clock',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                        [
                            'id' => 'categories',
                            'title' => 'Categories',
                            'url' => '/admin/categories',
                            'icon' => 'Tag',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                    ],
                    'is_active' => true,
                    'css_class' => '',
                ],
                [
                    'id' => 'payments',
                    'title' => 'Payments',
                    'url' => '/admin/payments',
                    'icon' => 'CreditCard',
                    'has_children' => false,
                    'children' => [],
                    'is_active' => true,
                    'css_class' => '',
                ],
                [
                    'id' => 'reports',
                    'title' => 'Reports',
                    'url' => '/admin/reports',
                    'icon' => 'TrendingUp',
                    'has_children' => false,
                    'children' => [],
                    'is_active' => true,
                    'css_class' => '',
                ],
                [
                    'id' => 'settings',
                    'title' => 'Settings',
                    'url' => '/admin/settings',
                    'icon' => 'Settings',
                    'has_children' => false,
                    'children' => [],
                    'is_active' => true,
                    'css_class' => '',
                ],
            ],
            'instructor' => [
                [
                    'id' => 'courses',
                    'title' => 'My Courses',
                    'url' => '/instructor/courses',
                    'icon' => 'BookOpen',
                    'has_children' => true,
                    'children' => [
                        [
                            'id' => 'all_courses',
                            'title' => 'All Courses',
                            'url' => '/instructor/courses',
                            'icon' => 'BookOpen',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                        [
                            'id' => 'create_course',
                            'title' => 'Create Course',
                            'url' => '/instructor/courses/create',
                            'icon' => 'Plus',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                        [
                            'id' => 'draft_courses',
                            'title' => 'Draft Courses',
                            'url' => '/instructor/courses?status=draft',
                            'icon' => 'FileText',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                    ],
                    'is_active' => true,
                    'css_class' => '',
                ],
                [
                    'id' => 'students',
                    'title' => 'Students',
                    'url' => '/instructor/students',
                    'icon' => 'GraduationCap',
                    'has_children' => false,
                    'children' => [],
                    'is_active' => true,
                    'css_class' => '',
                ],
                [
                    'id' => 'earnings',
                    'title' => 'Earnings',
                    'url' => '/instructor/earnings',
                    'icon' => 'DollarSign',
                    'has_children' => false,
                    'children' => [],
                    'is_active' => true,
                    'css_class' => '',
                ],
                [
                    'id' => 'analytics',
                    'title' => 'Analytics',
                    'url' => '/instructor/analytics',
                    'icon' => 'PieChart',
                    'has_children' => false,
                    'children' => [],
                    'is_active' => true,
                    'css_class' => '',
                ],
            ],
            'student' => [
                [
                    'id' => 'courses',
                    'title' => 'My Courses',
                    'url' => '/student/courses',
                    'icon' => 'BookOpen',
                    'has_children' => true,
                    'children' => [
                        [
                            'id' => 'enrolled_courses',
                            'title' => 'Enrolled Courses',
                            'url' => '/student/courses',
                            'icon' => 'BookOpen',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                        [
                            'id' => 'completed_courses',
                            'title' => 'Completed Courses',
                            'url' => '/student/courses?status=completed',
                            'icon' => 'CheckCircle',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                        [
                            'id' => 'in_progress',
                            'title' => 'In Progress',
                            'url' => '/student/courses?status=in_progress',
                            'icon' => 'Play',
                            'has_children' => false,
                            'children' => [],
                            'is_active' => true,
                            'css_class' => '',
                        ],
                    ],
                    'is_active' => true,
                    'css_class' => '',
                ],
                [
                    'id' => 'progress',
                    'title' => 'Progress',
                    'url' => '/student/progress',
                    'icon' => 'TrendingUp',
                    'has_children' => false,
                    'children' => [],
                    'is_active' => true,
                    'css_class' => '',
                ],
                [
                    'id' => 'certificates',
                    'title' => 'Certificates',
                    'url' => '/student/certificates',
                    'icon' => 'Award',
                    'has_children' => false,
                    'children' => [],
                    'is_active' => true,
                    'css_class' => '',
                ],
                [
                    'id' => 'wishlist',
                    'title' => 'Wishlist',
                    'url' => '/student/wishlist',
                    'icon' => 'Heart',
                    'has_children' => false,
                    'children' => [],
                    'is_active' => true,
                    'css_class' => '',
                ],
            ],
        ];

        return array_merge($commonItems, $roleSpecificItems[$role] ?? []);
    }
}