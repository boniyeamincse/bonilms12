import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const userRole = user.role?.name;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Define navigation items based on user role
    const getNavigationItems = () => {
        const commonItems = [
            { href: route('dashboard'), label: 'Dashboard', icon: '📊' },
        ];

        const roleSpecificItems = {
            admin: [
                { href: '/admin/users', label: 'Users', icon: '👥' },
                { href: '/admin/courses', label: 'Courses', icon: '📚' },
                { href: '/admin/payments', label: 'Payments', icon: '💰' },
                { href: '/admin/reports', label: 'Reports', icon: '📈' },
                { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
            ],
            instructor: [
                { href: '/instructor/courses', label: 'My Courses', icon: '📚' },
                { href: '/instructor/students', label: 'Students', icon: '👨‍🎓' },
                { href: '/instructor/earnings', label: 'Earnings', icon: '💰' },
                { href: '/instructor/analytics', label: 'Analytics', icon: '📊' },
            ],
            student: [
                { href: '/student/courses', label: 'My Courses', icon: '📚' },
                { href: '/student/progress', label: 'Progress', icon: '📈' },
                { href: '/student/certificates', label: 'Certificates', icon: '🏆' },
                { href: '/student/wishlist', label: 'Wishlist', icon: '❤️' },
            ],
        };

        return [...commonItems, ...(roleSpecificItems[userRole] || [])];
    };

    const navigationItems = getNavigationItems();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="h-8 w-auto" />
                                <span className="ml-2 text-xl font-bold text-gray-900">BoniLMS</span>
                            </Link>
                        </div>
                        <nav className="mt-8 flex-1 px-2 space-y-1">
                            {navigationItems.map((item, index) => (
                                <NavLink
                                    key={index}
                                    href={item.href}
                                    active={route().current(item.href.replace('/', '').replace('/', '.'))}
                                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                <p className="text-xs font-medium text-gray-500 capitalize">{userRole}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-64 flex flex-col flex-1">
                {/* Top navigation */}
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex">
                            {header && (
                                <div className="ml-4 flex items-center">
                                    {header}
                                </div>
                            )}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Notifications */}
                            <button className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-300 dark:hover:text-gray-200">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            {/* Profile dropdown */}
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500">
                                                <span className="text-sm font-medium leading-none text-white">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </span>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile sidebar */}
                <div className={`fixed inset-0 flex z-40 md:hidden ${showingNavigationDropdown ? '' : 'hidden'}`}>
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowingNavigationDropdown(false)} />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setShowingNavigationDropdown(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4">
                                <ApplicationLogo className="h-8 w-auto" />
                                <span className="ml-2 text-xl font-bold text-gray-900">BoniLMS</span>
                            </div>
                            <nav className="mt-8 flex-1 px-2 space-y-1">
                                {navigationItems.map((item, index) => (
                                    <ResponsiveNavLink
                                        key={index}
                                        href={item.href}
                                        active={route().current(item.href.replace('/', '').replace('/', '.'))}
                                        onClick={() => setShowingNavigationDropdown(false)}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        {item.label}
                                    </ResponsiveNavLink>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                            <div className="flex items-center">
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                    <p className="text-xs font-medium text-gray-500 capitalize">{userRole}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
