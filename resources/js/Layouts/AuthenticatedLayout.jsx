import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import { Search, BarChart3, Users, BookOpen, CreditCard, TrendingUp, Settings, GraduationCap, DollarSign, PieChart, Heart, Award, ChevronDown, ChevronRight, Circle, Shield, Tag, CheckCircle, Play, FileText, Plus } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const userRole = user.role?.name;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [navigationItems, setNavigationItems] = useState([]);
    const [navigationLoading, setNavigationLoading] = useState(true);
    const [openSubMenus, setOpenSubMenus] = useState({});

    // Fetch navigation items from API
    useEffect(() => {
        fetchNavigationItems();
    }, [userRole]);

    const fetchNavigationItems = async () => {
        try {
            const response = await axios.get('/api/navigation/menu');
            setNavigationItems(response.data.navigation || []);
        } catch (error) {
            console.error('Error fetching navigation:', error);
            // Fallback to empty array if API fails
            setNavigationItems([]);
        } finally {
            setNavigationLoading(false);
        }
    };

    // Icon mapping function
    const getIconComponent = (iconName) => {
        const iconMap = {
            BarChart3, Users, BookOpen, CreditCard, TrendingUp, Settings,
            GraduationCap, DollarSign, PieChart, Heart, Award, Circle,
            Shield, Tag, CheckCircle, Play, FileText, Plus
        };
        return iconMap[iconName] || Circle;
    };

    // Toggle sub-menu function
    const toggleSubMenu = (itemId) => {
        setOpenSubMenus(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // For admin users, redirect to users page with search
            if (userRole === 'admin') {
                router.visit('/admin/users', {
                    data: { search: searchQuery.trim() }
                });
            } else if (userRole === 'instructor') {
                // For instructors, search their courses
                router.visit('/instructor/courses', {
                    data: { search: searchQuery.trim() }
                });
            } else {
                // For students, search courses
                router.visit('/student/courses', {
                    data: { search: searchQuery.trim() }
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Skip to main content link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50"
            >
                Skip to main content
            </a>

            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0" role="navigation" aria-label="Main navigation">
                <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <Link href="/" className="flex items-center" aria-label="BoniLMS Home">
                                <ApplicationLogo className="h-8 w-auto" />
                                <span className="ml-2 text-xl font-bold text-gray-900">BoniLMS</span>
                            </Link>
                        </div>
                        <nav className="mt-8 flex-1 px-2 space-y-1" role="navigation" aria-label="Main menu">
                            {navigationLoading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                                </div>
                            ) : (
                                navigationItems.map((item, index) => (
                                    <div key={item.id || index}>
                                        <div
                                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                item.has_children ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                                            }`}
                                            onClick={() => item.has_children && toggleSubMenu(item.id)}
                                            aria-expanded={item.has_children ? openSubMenus[item.id] : undefined}
                                        >
                                            {item.has_children ? (
                                                <>
                                                    {openSubMenus[item.id] ? (
                                                        <ChevronDown className="mr-2 h-4 w-4" aria-hidden="true" />
                                                    ) : (
                                                        <ChevronRight className="mr-2 h-4 w-4" aria-hidden="true" />
                                                    )}
                                                </>
                                            ) : (
                                                <div className="mr-6"></div>
                                            )}
                                            {React.createElement(getIconComponent(item.icon), {
                                                className: "mr-3 h-5 w-5",
                                                'aria-hidden': true
                                            })}
                                            {item.title}
                                        </div>

                                        {item.has_children && openSubMenus[item.id] && (
                                            <div className="ml-8 mt-1 space-y-1">
                                                {item.children.map((child, childIndex) => (
                                                    <NavLink
                                                        key={child.id || childIndex}
                                                        href={child.url}
                                                        active={route().current(child.url.replace('/', '').replace('/', '.'))}
                                                        className="group flex items-center px-2 py-2 text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                        aria-current={route().current(child.url.replace('/', '').replace('/', '.')) ? 'page' : undefined}
                                                    >
                                                        {React.createElement(getIconComponent(child.icon), {
                                                            className: "mr-2 h-4 w-4",
                                                            'aria-hidden': true
                                                        })}
                                                        {child.title}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
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
                <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow" role="banner">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                        aria-expanded={showingNavigationDropdown}
                        aria-controls="mobile-menu"
                        aria-label="Toggle navigation menu"
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                        <nav className="ml-4 flex items-center md:ml-6" role="navigation" aria-label="User actions">
                            {/* Search */}
                            <div className="hidden md:block">
                                <form onSubmit={handleSearch} role="search">
                                    <label htmlFor="search-input" className="sr-only">Search</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="search-input"
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search..."
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            aria-describedby="search-help"
                                        />
                                        <div id="search-help" className="sr-only">Press Enter to search</div>
                                    </div>
                                </form>
                            </div>

                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Notifications */}
                            <button
                                className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-300 dark:hover:text-gray-200"
                                aria-label="View notifications"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            {/* Profile dropdown */}
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            aria-label={`User menu for ${user.name}`}
                                            aria-haspopup="menu"
                                            aria-expanded="false"
                                        >
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500">
                                                <span className="text-sm font-medium leading-none text-white">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </span>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content role="menu" aria-label="User menu">
                                        <Dropdown.Link href={route('profile.edit')} role="menuitem">
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" role="menuitem">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Mobile sidebar */}
                <div className={`fixed inset-0 flex z-40 md:hidden ${showingNavigationDropdown ? '' : 'hidden'}`} role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title" id="mobile-menu">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowingNavigationDropdown(false)} aria-hidden="true" />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setShowingNavigationDropdown(false)}
                                aria-label="Close navigation menu"
                            >
                                <span className="sr-only">Close sidebar</span>
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4">
                                <h2 id="mobile-menu-title" className="sr-only">Navigation Menu</h2>
                                <ApplicationLogo className="h-8 w-auto" />
                                <span className="ml-2 text-xl font-bold text-gray-900">BoniLMS</span>
                            </div>
                            <nav className="mt-8 flex-1 px-2 space-y-1" role="navigation" aria-label="Mobile navigation">
                                {navigationLoading ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                                    </div>
                                ) : (
                                    navigationItems.map((item, index) => (
                                        <div key={item.id || index}>
                                            <ResponsiveNavLink
                                                href={item.has_children ? '#' : item.url}
                                                active={!item.has_children && route().current(item.url.replace('/', '').replace('/', '.'))}
                                                onClick={() => {
                                                    if (item.has_children) {
                                                        toggleSubMenu(item.id);
                                                    } else {
                                                        setShowingNavigationDropdown(false);
                                                    }
                                                }}
                                                aria-current={!item.has_children && route().current(item.url.replace('/', '').replace('/', '.')) ? 'page' : undefined}
                                            >
                                                {item.has_children ? (
                                                    <>
                                                        {openSubMenus[item.id] ? (
                                                            <ChevronDown className="mr-2 h-4 w-4" aria-hidden="true" />
                                                        ) : (
                                                            <ChevronRight className="mr-2 h-4 w-4" aria-hidden="true" />
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="mr-6"></div>
                                                )}
                                                {React.createElement(getIconComponent(item.icon), {
                                                    className: "mr-3 h-5 w-5",
                                                    'aria-hidden': true
                                                })}
                                                {item.title}
                                            </ResponsiveNavLink>

                                            {item.has_children && openSubMenus[item.id] && (
                                                <div className="ml-8 mt-1 space-y-1">
                                                    {item.children.map((child, childIndex) => (
                                                        <ResponsiveNavLink
                                                            key={child.id || childIndex}
                                                            href={child.url}
                                                            active={route().current(child.url.replace('/', '').replace('/', '.'))}
                                                            onClick={() => setShowingNavigationDropdown(false)}
                                                            className="text-xs"
                                                            aria-current={route().current(child.url.replace('/', '').replace('/', '.')) ? 'page' : undefined}
                                                        >
                                                            {React.createElement(getIconComponent(child.icon), {
                                                                className: "mr-2 h-4 w-4",
                                                                'aria-hidden': true
                                                            })}
                                                            {child.title}
                                                        </ResponsiveNavLink>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-gray-200 p-4" role="contentinfo">
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
                <main id="main-content" className="flex-1 bg-gray-50 dark:bg-gray-900" role="main">
                    {children}
                </main>
            </div>
        </div>
    );
}
