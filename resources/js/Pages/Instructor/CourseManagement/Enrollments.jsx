import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Download, Users, TrendingUp, Award, Clock } from 'lucide-react';

export default function Enrollments({ course }) {
    const enrollments = course.enrollments || [];

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getGradeColor = (grade) => {
        if (!grade) return 'text-gray-500';
        if (grade >= 80) return 'text-green-600';
        if (grade >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter(e => e.completed_at).length;
    const averageProgress = totalEnrollments > 0
        ? enrollments.reduce((sum, e) => sum + e.completion_percentage, 0) / totalEnrollments
        : 0;
    const averageGrade = enrollments.filter(e => e.grade).length > 0
        ? enrollments.filter(e => e.grade).reduce((sum, e) => sum + e.grade, 0) / enrollments.filter(e => e.grade).length
        : 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Course Enrollments - {course.title}
                </h2>
            }
        >
            <Head title="Course Enrollments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <Users className="w-8 h-8 text-blue-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Enrollments</p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalEnrollments}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <Award className="w-8 h-8 text-green-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{completedEnrollments}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <TrendingUp className="w-8 h-8 text-yellow-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Progress</p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{averageProgress.toFixed(1)}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <Award className="w-8 h-8 text-purple-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Grade</p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                            {averageGrade > 0 ? `${averageGrade.toFixed(1)}%` : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className="mb-6">
                        <PrimaryButton
                            onClick={() => window.open(route('instructor.courses.enrollments.export', course.id), '_blank')}
                            className="flex items-center"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export Student Data (CSV)
                        </PrimaryButton>
                    </div>

                    {/* Enrollments Table */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Student Enrollments</h3>
                        </div>

                        <div className="overflow-x-auto">
                            {enrollments.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No enrollments yet</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Students will appear here once they enroll in your course.
                                    </p>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Progress
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Grade
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Enrolled
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {enrollments.map((enrollment) => (
                                            <tr key={enrollment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {enrollment.user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {enrollment.user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {enrollment.user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                                                            <div
                                                                className={`h-2 rounded-full ${getProgressColor(enrollment.completion_percentage)}`}
                                                                style={{ width: `${enrollment.completion_percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {enrollment.completion_percentage}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm font-medium ${getGradeColor(enrollment.grade)}`}>
                                                        {enrollment.grade ? `${enrollment.grade}%` : 'Not graded'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {enrollment.completed_at ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            <Award className="w-3 h-3 mr-1" />
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            In Progress
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}