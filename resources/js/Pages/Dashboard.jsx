import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import {
    TrendingUp,
    Users,
    DollarSign,
    BookOpen,
    Star,
    CheckCircle,
    XCircle,
    Clock,
    Activity,
    Database,
    Shield,
    Bell,
    Plus,
    Play,
    FileText,
    Award,
    Heart,
    MessageSquare,
    Calendar,
    Download
} from 'lucide-react';

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const userRole = user.role?.name;
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);

    console.log('Dashboard component rendered', {
        user: user,
        userRole: userRole,
        hasRole: !!user.role,
        roleName: user.role?.name
    });

    useEffect(() => {
        fetchMetrics();
    }, [userRole]);

    const fetchMetrics = async () => {
        try {
            console.log('Fetching metrics for role:', userRole);
            const response = await axios.get(`/api/dashboard/${userRole}/metrics`);
            console.log('Metrics response:', response.data);
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching metrics:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const renderAdminDashboard = () => {
        const revenueData = [
            { month: 'Jan', revenue: 4000 },
            { month: 'Feb', revenue: 3000 },
            { month: 'Mar', revenue: 5000 },
            { month: 'Apr', revenue: 4500 },
            { month: 'May', revenue: 6000 },
            { month: 'Jun', revenue: 5500 }
        ];

        const enrollmentData = [
            { category: 'Technology', enrollments: 120 },
            { category: 'Business', enrollments: 80 },
            { category: 'Design', enrollments: 60 },
            { category: 'Marketing', enrollments: 90 }
        ];

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

        return (
            <div className="space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <DollarSign className="w-8 h-8 text-green-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Revenue</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">${metrics.total_revenue || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Students</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">{metrics.active_students || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingUp className="w-8 h-8 text-purple-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">New Enrollments</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">{metrics.new_enrollments || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <DollarSign className="w-8 h-8 text-yellow-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Instructor Payouts</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">${metrics.instructor_payouts || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Approval Queue */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Course Approval Queue</h3>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                        <div className="space-y-4">
                            {metrics.pending_courses?.slice(0, 3).map((course, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">by {course.instructor?.name} • Submitted {course.created_at}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Approve
                                        </button>
                                        <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            )) || []}
                            {(!metrics.pending_courses || metrics.pending_courses.length === 0) && (
                                <div className="text-center py-8">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending courses</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">All courses have been processed.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Reports & Analytics */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Revenue Trend</h3>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Enrollments by Category */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Enrollments by Category</h3>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={enrollmentData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="enrollments"
                                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {enrollmentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* System Health */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">System Health</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Database className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                                </div>
                                <span className="text-sm font-medium text-green-600">Online</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5 text-green-500 mr-2" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Security</span>
                                </div>
                                <span className="text-sm font-medium text-green-600">Protected</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Activity className="w-5 h-5 text-yellow-500 mr-2" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                                </div>
                                <span className="text-sm font-medium text-yellow-600">99.9%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 text-blue-500 mr-2" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Queue Jobs</span>
                                </div>
                                <span className="text-sm font-medium text-blue-600">{metrics.queue_jobs || 0} pending</span>
                            </div>
                        </div>
                    </div>

                    {/* Notifications & Audit Log */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Activity</h3>
                        </div>
                        <div className="px-4 py-5 sm:px-6">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {metrics.audit_log?.slice(0, 5).map((log, index) => (
                                    <li key={index} className="py-3">
                                        <div className="flex items-center">
                                            <Bell className="w-4 h-4 text-gray-400 mr-3" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900 dark:text-white">{log.action}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{log.timestamp}</p>
                                            </div>
                                        </div>
                                    </li>
                                )) || []}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderInstructorDashboard = () => {
        const salesData = [
            { day: 'Mon', sales: 120 },
            { day: 'Tue', sales: 150 },
            { day: 'Wed', sales: 180 },
            { day: 'Thu', sales: 200 },
            { day: 'Fri', sales: 220 },
            { day: 'Sat', sales: 190 },
            { day: 'Sun', sales: 160 }
        ];

        return (
            <div className="space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <DollarSign className="w-8 h-8 text-green-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Today's Sales</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">${metrics.todays_sales || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Students</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">{metrics.total_students || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Star className="w-8 h-8 text-yellow-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Course Rating</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">{metrics.average_rating || 0}/5</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Clock className="w-8 h-8 text-purple-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending Assignments</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">{metrics.pending_assignments || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Course Performance */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Course Performance</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {metrics.courses?.slice(0, 3).map((course, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</h4>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                                                <span>{course.enrollments} students</span>
                                                <span>{course.completion_rate}% completion</span>
                                                <span>{course.average_rating} ⭐</span>
                                            </div>
                                            <div className="mt-2">
                                                <div className="flex items-center">
                                                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${course.completion_rate}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="ml-2 text-sm text-gray-500">{course.completion_rate}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) || []}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Quick Actions</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Course
                            </button>
                            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Add New Lesson
                            </button>
                            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                <FileText className="w-4 h-4 mr-2" />
                                Create Quiz
                            </button>
                            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                <Users className="w-4 h-4 mr-2" />
                                View Students
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Earnings & Withdrawals */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Earnings & Withdrawals</h3>
                        </div>
                        <div className="p-6">
                            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Available Balance</p>
                                        <p className="text-3xl font-bold">${metrics.available_balance || 0}</p>
                                    </div>
                                    <DollarSign className="w-12 h-12 opacity-80" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Request Payout
                                </button>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">This month</span>
                                    <span className="font-medium">${metrics.monthly_earnings || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Total earnings</span>
                                    <span className="font-medium">${metrics.total_earnings || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sales Chart */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Weekly Sales</h3>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="sales" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Student Activity */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Student Activity</h3>
                        </div>
                        <div className="px-4 py-5 sm:px-6">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {metrics.student_activity?.slice(0, 4).map((activity, index) => (
                                    <li key={index} className="py-3">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        {activity.student?.name?.charAt(0)?.toUpperCase() || 'S'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <p className="text-sm text-gray-900 dark:text-white">{activity.student?.name} {activity.action}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</p>
                                            </div>
                                        </div>
                                    </li>
                                )) || []}
                            </ul>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Latest Reviews</h3>
                        </div>
                        <div className="px-4 py-5 sm:px-6">
                            <div className="space-y-4">
                                {metrics.latest_reviews?.slice(0, 3).map((review, index) => (
                                    <div key={index} className="border-l-4 border-yellow-400 pl-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">{review.created_at}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-900 dark:text-white">"{review.comment}"</p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">by {review.student?.name} on {review.course?.title}</p>
                                        <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                                            Reply to review
                                        </button>
                                    </div>
                                )) || []}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderStudentDashboard = () => {
        const progressData = [
            { subject: 'React', progress: 85 },
            { subject: 'JavaScript', progress: 70 },
            { subject: 'CSS', progress: 90 },
            { subject: 'Node.js', progress: 45 },
            { subject: 'Python', progress: 60 }
        ];

        return (
            <div className="space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <BookOpen className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Courses in Progress</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">{metrics.courses_in_progress?.length || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <TrendingUp className="w-8 h-8 text-green-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Completion %</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">{metrics.completion_percentage || 0}%</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Award className="w-8 h-8 text-yellow-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Certificates Earned</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">{metrics.certificates_earned || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Calendar className="w-8 h-8 text-purple-500" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Streak Days</dt>
                                        <dd className="text-lg font-medium text-gray-900 dark:text-white">{metrics.streak_days || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Continue Learning */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Continue Learning</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {metrics.continue_learning?.slice(0, 4).map((course, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{course.enrollment?.course?.title}</h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Last accessed {course.last_accessed}</span>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{course.completion_percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${course.completion_percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <button className="w-full flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                        <Play className="w-4 h-4 mr-2" />
                                        Resume
                                    </button>
                                </div>
                            )) || []}
                        </div>
                        {(metrics.continue_learning?.length === 0) && (
                            <div className="text-center py-12">
                                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No courses in progress</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start learning by enrolling in a course!</p>
                                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                    Browse Courses
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upcoming Lessons/Assignments */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Upcoming Deadlines</h3>
                        </div>
                        <div className="px-4 py-5 sm:px-6">
                            <div className="space-y-4">
                                {metrics.upcoming_deadlines?.slice(0, 4).map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center">
                                            <Calendar className="w-5 h-5 text-red-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.course} • Due {item.due_date}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            item.days_left <= 1 ? 'bg-red-100 text-red-800' :
                                            item.days_left <= 3 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {item.days_left} days
                                        </span>
                                    </div>
                                )) || []}
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Achievements</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                {metrics.achievements?.slice(0, 4).map((achievement, index) => (
                                    <div key={index} className="text-center">
                                        <div className="w-12 h-12 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{achievement.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                                        <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                                            <Download className="w-3 h-3 inline mr-1" />
                                            Download
                                        </button>
                                    </div>
                                )) || []}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Wishlist & Recommendations */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recommended for You</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {metrics.recommendations?.slice(0, 3).map((course, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                <BookOpen className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">by {course.instructor} • {course.duration}</p>
                                            <div className="flex items-center mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < course.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                                                ))}
                                                <span className="ml-1 text-xs text-gray-500">({course.students})</span>
                                            </div>
                                        </div>
                                        <button className="text-xs text-blue-600 hover:text-blue-800">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                    </div>
                                )) || []}
                            </div>
                        </div>
                    </div>

                    {/* Progress Chart */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Learning Progress</h3>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={progressData} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" domain={[0, 100]} />
                                    <YAxis dataKey="subject" type="category" width={80} />
                                    <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                                    <Bar dataKey="progress" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Support & Discussions */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Discussions</h3>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                        <div className="space-y-4">
                            {metrics.discussions?.slice(0, 3).map((discussion, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {discussion.author?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{discussion.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{discussion.course} • by {discussion.author}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{discussion.last_reply}</p>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                        <MessageSquare className="w-3 h-3 mr-1" />
                                        {discussion.replies}
                                    </div>
                                </div>
                            )) || []}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDashboard = () => {
        switch (userRole) {
            case 'admin':
                return renderAdminDashboard();
            case 'instructor':
                return renderInstructorDashboard();
            case 'student':
                return renderStudentDashboard();
            default:
                return <div className="text-center py-12">Invalid user role</div>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 capitalize">
                    {userRole} Dashboard
                </h2>
            }
        >
            <Head title={`${userRole} Dashboard`} />

            <div className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading dashboard...</p>
                        </div>
                    ) : (
                        renderDashboard()
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
