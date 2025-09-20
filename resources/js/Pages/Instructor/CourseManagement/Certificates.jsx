import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Award, Download, Plus, CheckCircle, XCircle } from 'lucide-react';

export default function Certificates({ course }) {
    const [generating, setGenerating] = useState(null);
    const certificates = course.certificates || [];

    const generateCertificate = async (enrollmentId) => {
        setGenerating(enrollmentId);
        try {
            const response = await fetch(route('instructor.courses.certificates.generate', [course.id, enrollmentId]), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ template: 'default' }),
            });

            const result = await response.json();

            if (response.ok) {
                // Refresh the page to show the new certificate
                window.location.reload();
            } else {
                alert(result.error || 'Failed to generate certificate');
            }
        } catch (error) {
            alert('An error occurred while generating the certificate');
        } finally {
            setGenerating(null);
        }
    };

    const downloadCertificate = (certificateId) => {
        window.open(route('instructor.courses.certificates.download', [course.id, certificateId]), '_blank');
    };

    // Get enrollments that can receive certificates (completed but no certificate yet)
    const eligibleEnrollments = course.enrollments?.filter(enrollment =>
        enrollment.completed_at &&
        enrollment.completion_percentage >= 100 &&
        !certificates.some(cert => cert.enrollment_id === enrollment.id)
    ) || [];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Course Certificates - {course.title}
                </h2>
            }
        >
            <Head title="Course Certificates" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <Award className="w-8 h-8 text-blue-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Certificates Issued</p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{certificates.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Eligible Students</p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{eligibleEnrollments.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <XCircle className="w-8 h-8 text-yellow-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Certificates</p>
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                            {(course.enrollments?.length || 0) - certificates.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Issued Certificates */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Issued Certificates</h3>
                        </div>

                        <div className="overflow-x-auto">
                            {certificates.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <Award className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No certificates issued yet</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Certificates will appear here once students complete the course.
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
                                                Certificate Number
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Issued Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Grade
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {certificates.map((certificate) => (
                                            <tr key={certificate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {certificate.enrollment.user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {certificate.enrollment.user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {certificate.enrollment.user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                                                    {certificate.certificate_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {new Date(certificate.issued_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm font-medium ${
                                                        certificate.custom_data?.grade >= 80 ? 'text-green-600' :
                                                        certificate.custom_data?.grade >= 60 ? 'text-yellow-600' :
                                                        'text-red-600'
                                                    }`}>
                                                        {certificate.custom_data?.grade ? `${certificate.custom_data.grade}%` : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <SecondaryButton
                                                        onClick={() => downloadCertificate(certificate.id)}
                                                        className="flex items-center"
                                                    >
                                                        <Download className="w-4 h-4 mr-1" />
                                                        Download
                                                    </SecondaryButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Eligible Students */}
                    {eligibleEnrollments.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Generate Certificates</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Students who have completed the course and are eligible for certificates.
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Student
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Completion Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Grade
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {eligibleEnrollments.map((enrollment) => (
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {new Date(enrollment.completed_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm font-medium ${
                                                        enrollment.grade >= 80 ? 'text-green-600' :
                                                        enrollment.grade >= 60 ? 'text-yellow-600' :
                                                        'text-red-600'
                                                    }`}>
                                                        {enrollment.grade ? `${enrollment.grade}%` : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <PrimaryButton
                                                        onClick={() => generateCertificate(enrollment.id)}
                                                        disabled={generating === enrollment.id}
                                                        className="flex items-center"
                                                    >
                                                        {generating === enrollment.id ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                                                                Generating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Award className="w-4 h-4 mr-1" />
                                                                Generate Certificate
                                                            </>
                                                        )}
                                                    </PrimaryButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}