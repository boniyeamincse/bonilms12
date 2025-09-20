import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, User, BookOpen, DollarSign } from 'lucide-react';

export default function CourseReviewsQueue({ courses }) {
    const [pendingCourses, setPendingCourses] = useState(courses.data || []);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [reviewNote, setReviewNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleApprove = async (courseId) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/courses/${courseId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ notes: reviewNote })
            });

            if (response.ok) {
                setPendingCourses(pendingCourses.filter(course => course.id !== courseId));
                setSelectedCourse(null);
                setReviewNote('');
                alert('Course approved successfully!');
            }
        } catch (error) {
            console.error('Error approving course:', error);
        }
        setLoading(false);
    };

    const handleReject = async (courseId) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/courses/${courseId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ notes: reviewNote })
            });

            if (response.ok) {
                setPendingCourses(pendingCourses.filter(course => course.id !== courseId));
                setSelectedCourse(null);
                setReviewNote('');
                alert('Course rejected successfully!');
            }
        } catch (error) {
            console.error('Error rejecting course:', error);
        }
        setLoading(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Course Review Queue
                </h2>
            }
        >
            <Head title="Course Review Queue" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Queue List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium mb-4 flex items-center">
                                        <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                                        Pending Course Reviews ({pendingCourses.length})
                                    </h3>

                                    <div className="space-y-4">
                                        {pendingCourses.length === 0 ? (
                                            <div className="text-center py-8">
                                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400">No courses pending review!</p>
                                            </div>
                                        ) : (
                                            pendingCourses.map((course) => (
                                                <div
                                                    key={course.id}
                                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                        selectedCourse?.id === course.id
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => setSelectedCourse(course)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                                {course.title}
                                                            </h4>
                                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                <User className="h-4 w-4 mr-1" />
                                                                {course.instructor?.name || 'Unknown Instructor'}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                <BookOpen className="h-4 w-4 mr-1" />
                                                                Category: {course.category?.name || 'Uncategorized'}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                <DollarSign className="h-4 w-4 mr-1" />
                                                                Price: ${course.price}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                Pending Review
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        Submitted: {new Date(course.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    {selectedCourse ? (
                                        <>
                                            <h3 className="text-lg font-medium mb-4">Review Course</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                        {selectedCourse.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        by {selectedCourse.instructor?.name}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Review Notes (Optional)
                                                    </label>
                                                    <textarea
                                                        value={reviewNote}
                                                        onChange={(e) => setReviewNote(e.target.value)}
                                                        placeholder="Add any notes about this course..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                        rows={4}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <button
                                                        onClick={() => handleApprove(selectedCourse.id)}
                                                        disabled={loading}
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 flex items-center justify-center"
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Approve Course
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(selectedCourse.id)}
                                                        disabled={loading}
                                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 flex items-center justify-center"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Reject Course
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Select a course to review
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}