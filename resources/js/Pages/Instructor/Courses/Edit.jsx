import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Upload, Trash2 } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Head } from '@inertiajs/react';

export default function Edit({ course, categories }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        title: course.title || '',
        description: course.description || '',
        category_id: course.category_id || '',
        subcategory: course.subcategory || '',
        level: course.level || 'beginner',
        image: null,
        banner: null,
        status: course.status || 'draft',
    });

    const [imagePreview, setImagePreview] = useState(course.image ? `/storage/${course.image}` : null);
    const [bannerPreview, setBannerPreview] = useState(course.banner ? `/storage/${course.banner}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        setData('banner', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setBannerPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const removeBanner = () => {
        setData('banner', null);
        setBannerPreview(null);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('instructor.courses.update', course.id));
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            // This would need to be implemented with router.delete
            // For now, we'll show an alert
            alert('Delete functionality would be implemented here');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Head title="Edit Course" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Link href={route('instructor.courses.index')}>
                        <SecondaryButton className="mr-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Courses
                        </SecondaryButton>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
                </div>
                <DangerButton onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Course
                </DangerButton>
            </div>

            <form onSubmit={submit} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <InputLabel htmlFor="title" value="Course Title" />
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Enter course title"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        {/* Description */}
                        <div>
                            <InputLabel htmlFor="description" value="Course Description" />
                            <textarea
                                id="description"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="6"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter course description"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        {/* Category */}
                        <div>
                            <InputLabel htmlFor="category_id" value="Category" />
                            <select
                                id="category_id"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.category_id} className="mt-2" />
                        </div>

                        {/* Subcategory */}
                        <div>
                            <InputLabel htmlFor="subcategory" value="Subcategory (Optional)" />
                            <TextInput
                                id="subcategory"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.subcategory}
                                onChange={(e) => setData('subcategory', e.target.value)}
                                placeholder="Enter subcategory"
                            />
                            <InputError message={errors.subcategory} className="mt-2" />
                        </div>

                        {/* Level */}
                        <div>
                            <InputLabel value="Course Level" />
                            <div className="mt-2 space-y-2">
                                {['beginner', 'intermediate', 'advanced'].map((level) => (
                                    <label key={level} className="inline-flex items-center mr-6">
                                        <input
                                            type="radio"
                                            className="form-radio"
                                            name="level"
                                            value={level}
                                            checked={data.level === level}
                                            onChange={(e) => setData('level', e.target.value)}
                                        />
                                        <span className="ml-2 capitalize">{level}</span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.level} className="mt-2" />
                        </div>

                        {/* Status */}
                        <div>
                            <InputLabel value="Course Status" />
                            <div className="mt-2 space-y-2">
                                {[
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'pending_approval', label: 'Pending Approval' },
                                    { value: 'published', label: 'Published' }
                                ].map((status) => (
                                    <label key={status.value} className="inline-flex items-center mr-6">
                                        <input
                                            type="radio"
                                            className="form-radio"
                                            name="status"
                                            value={status.value}
                                            checked={data.status === status.value}
                                            onChange={(e) => setData('status', e.target.value)}
                                        />
                                        <span className="ml-2">{status.label}</span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.status} className="mt-2" />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Course Image */}
                        <div>
                            <InputLabel value="Course Image" />
                            <div className="mt-1">
                                <div className="border-2 border-gray-300 border-dashed rounded-lg p-4">
                                    <div className="text-center">
                                        {imagePreview ? (
                                            <div className="space-y-4">
                                                <img
                                                    src={imagePreview}
                                                    alt="Course preview"
                                                    className="max-h-48 mx-auto rounded-lg"
                                                />
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => document.getElementById('image-upload').click()}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        Change image
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div>
                                                    <label htmlFor="image-upload" className="cursor-pointer">
                                                        <span className="mt-2 block text-sm font-medium text-gray-900">
                                                            Upload course image
                                                        </span>
                                                    </label>
                                                    <input
                                                        id="image-upload"
                                                        name="image"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="sr-only"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 2MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <InputError message={errors.image} className="mt-2" />
                        </div>

                        {/* Course Banner */}
                        <div>
                            <InputLabel value="Course Banner (Optional)" />
                            <div className="mt-1">
                                <div className="border-2 border-gray-300 border-dashed rounded-lg p-4">
                                    <div className="text-center">
                                        {bannerPreview ? (
                                            <div className="space-y-4">
                                                <img
                                                    src={bannerPreview}
                                                    alt="Banner preview"
                                                    className="max-h-32 mx-auto rounded-lg"
                                                />
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => document.getElementById('banner-upload').click()}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        Change banner
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={removeBanner}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div>
                                                    <label htmlFor="banner-upload" className="cursor-pointer">
                                                        <span className="mt-2 block text-sm font-medium text-gray-900">
                                                            Upload course banner
                                                        </span>
                                                    </label>
                                                    <input
                                                        id="banner-upload"
                                                        name="banner"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleBannerChange}
                                                        className="sr-only"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF up to 2MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <InputError message={errors.banner} className="mt-2" />
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                    <Link href={route('instructor.courses.index')}>
                        <SecondaryButton type="button">
                            Cancel
                        </SecondaryButton>
                    </Link>
                    <PrimaryButton type="submit" disabled={processing}>
                        <Save className="w-4 h-4 mr-2" />
                        Update Course
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}