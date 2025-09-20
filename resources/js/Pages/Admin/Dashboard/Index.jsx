import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Users, BookOpen, CreditCard, TrendingUp, DollarSign, Award } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard({ stats }) {
    const [metrics, setMetrics] = useState(stats || {});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/dashboard/admin/metrics');
            const data = await response.json();
            setMetrics(data);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        }
        setLoading(false);
    };

    const paymentsChartData = {
        labels: Object.keys(metrics.charts?.payments || {}),
        datasets: [{
            label: 'Revenue',
            data: Object.values(metrics.charts?.payments || {}),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
        }],
    };

    const enrollmentsChartData = {
        labels: Object.keys(metrics.charts?.enrollments || {}),
        datasets: [{
            label: 'Enrollments',
            data: Object.values(metrics.charts?.enrollments || {}),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    };

    const topCategoriesData = {
        labels: (metrics.charts?.top_categories || []).map(cat => cat.name),
        datasets: [{
            label: 'Revenue',
            data: (metrics.charts?.top_categories || []).map(cat => cat.revenue),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }],
    };

    const cards = [
        {
            title: 'Total Users',
            value: metrics.total_users || 0,
            icon: Users,
            color: 'blue',
        },
        {
            title: 'Total Courses',
            value: metrics.total_courses || 0,
            icon: BookOpen,
            color: 'green',
        },
        {
            title: 'Total Enrollments',
            value: metrics.total_enrollments || 0,
            icon: Award,
            color: 'purple',
        },
        {
            title: 'Total Revenue',
            value: `$${metrics.total_revenue || 0}`,
            icon: DollarSign,
            color: 'yellow',
        },
        {
            title: 'Pending Courses',
            value: metrics.pending_courses || 0,
            icon: BookOpen,
            color: 'red',
        },
        {
            title: 'Active Instructors',
            value: metrics.total_instructors || 0,
            icon: Users,
            color: 'indigo',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-medium mb-6">Overview</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cards.map((card, index) => (
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900`}>
                                                <card.icon className={`h-6 w-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{card.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {loading && (
                                <div className="mt-6 text-center">
                                    <p className="text-gray-600 dark:text-gray-400">Loading metrics...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Queues */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4 text-red-600">Course Review Queue</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">Courses awaiting approval</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Requires immediate attention</p>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {metrics.pending_courses || 0} pending
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <a href="/admin/queues/course-reviews" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block text-center">
                                    Review Courses
                                </a>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4 text-orange-600">Withdrawal Requests</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">Pending instructor payouts</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Awaiting approval</p>
                                    </div>
                                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {metrics.pending_withdrawals || 0} pending
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <a href="/admin/queues/withdrawals" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block text-center">
                                    Process Withdrawals
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">Revenue Trend (Last 30 Days)</h3>
                            <Line data={paymentsChartData} />
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-medium mb-4">Enrollments Trend (Last 30 Days)</h3>
                            <Bar data={enrollmentsChartData} />
                        </div>
                    </div>

                    <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">Top Categories by Revenue</h3>
                        <Bar data={topCategoriesData} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}