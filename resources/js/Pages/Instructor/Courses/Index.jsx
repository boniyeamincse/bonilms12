import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Eye, BookOpen, Users, Star, DollarSign } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Head } from '@inertiajs/react';

export default function Index({ courses }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = courses.data.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (courseId) => {
        if (confirm('Are you sure you want to delete this course?')) {
            router.delete(route('instructor.courses.destroy', courseId));
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            draft: 'bg-gray-100 text-gray-800',
            pending_approval: 'bg-yellow-100 text-yellow-800',
            published: 'bg-green-100 text-green-800',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.replace('_', ' ').toUpperCase()}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Head title="My Courses" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
                <Link href={route('instructor.courses.create')}>
                    <PrimaryButton>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Course
                    </PrimaryButton>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* Course Image */}
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            {course.image ? (
                                <img
                                    src={`/storage/${course.image}`}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <BookOpen className="w-16 h-16 text-gray-400" />
                            )}
                        </div>

                        {/* Course Content */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                    {course.title}
                                </h3>
                                {getStatusBadge(course.status)}
                            </div>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                {course.description}
                            </p>

                            {course.category && (
                                <div className="text-sm text-gray-500 mb-2">
                                    Category: {course.category.name}
                                </div>
                            )}

                            <div className="text-sm text-gray-500 mb-4">
                                Level: {course.level}
                            </div>

                            {/* Stats */}
                            <div className="flex justify-between text-sm text-gray-500 mb-4">
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>0 Students</span>
                                </div>
                                <div className="flex items-center">
                                    <Star className="w-4 h-4 mr-1" />
                                    <span>0.0</span>
                                </div>
                                <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    <span>Free</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Link
                                    href={route('instructor.courses.edit', course.id)}
                                    className="flex-1"
                                >
                                    <SecondaryButton className="w-full">
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </SecondaryButton>
                                </Link>

                                <Link
                                    href={route('instructor.courses.manage', course.id)}
                                    className="flex-1"
                                >
                                    <SecondaryButton className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300">
                                        <Eye className="w-4 h-4 mr-1" />
                                        Manage
                                    </SecondaryButton>
                                </Link>

                                <button
                                    onClick={() => handleDelete(course.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Course"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500 mb-6">
                        {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first course.'}
                    </p>
                    <Link href={route('instructor.courses.create')}>
                        <PrimaryButton>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Course
                        </PrimaryButton>
                    </Link>
                </div>
            )}

            {/* Pagination */}
            {courses.last_page > 1 && (
                <div className="mt-8 flex justify-center">
                    <div className="flex gap-2">
                        {courses.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}