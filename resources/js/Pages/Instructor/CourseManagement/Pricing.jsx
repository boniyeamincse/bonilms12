import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { DollarSign, Tag, Percent, CreditCard } from 'lucide-react';

export default function Pricing({ course }) {
    const { data, setData, put, processing, errors } = useForm({
        pricing_type: course.pricing_type || 'paid',
        price: course.price || '',
        coupon_code: course.coupon_code || '',
        coupon_discount_type: course.coupon_discount_type || 'percentage',
        coupon_discount_value: course.coupon_discount_value || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('instructor.courses.pricing.update', course.id), {
            onSuccess: () => {
                // Handle success
            },
        });
    };

    const calculateDiscountedPrice = () => {
        if (!data.price || !data.coupon_discount_value) return data.price;

        if (data.coupon_discount_type === 'percentage') {
            return data.price * (1 - data.coupon_discount_value / 100);
        } else {
            return Math.max(0, data.price - data.coupon_discount_value);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Course Pricing - {course.title}
                </h2>
            }
        >
            <Head title="Course Pricing" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Pricing Type */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-medium mb-4 flex items-center">
                                        <DollarSign className="w-5 h-5 mr-2" />
                                        Pricing Type
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <input
                                                id="pricing_free"
                                                type="radio"
                                                value="free"
                                                checked={data.pricing_type === 'free'}
                                                onChange={(e) => setData('pricing_type', e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="pricing_free" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Free Course
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="pricing_paid"
                                                type="radio"
                                                value="paid"
                                                checked={data.pricing_type === 'paid'}
                                                onChange={(e) => setData('pricing_type', e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="pricing_paid" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                One-time Payment
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                id="pricing_subscription"
                                                type="radio"
                                                value="subscription"
                                                checked={data.pricing_type === 'subscription'}
                                                onChange={(e) => setData('pricing_type', e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="pricing_subscription" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Subscription
                                            </label>
                                        </div>
                                    </div>

                                    {data.pricing_type !== 'free' && (
                                        <div className="mt-4">
                                            <InputLabel htmlFor="price" value="Price (USD)" />
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                </div>
                                                <input
                                                    id="price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="mt-1 block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    value={data.price}
                                                    onChange={(e) => setData('price', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <InputError message={errors.price} className="mt-2" />
                                        </div>
                                    )}
                                </div>

                                {/* Coupon Section */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h3 className="text-lg font-medium mb-4 flex items-center">
                                        <Tag className="w-5 h-5 mr-2" />
                                        Discount Coupon
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="coupon_code" value="Coupon Code" />
                                            <TextInput
                                                id="coupon_code"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.coupon_code}
                                                onChange={(e) => setData('coupon_code', e.target.value)}
                                                placeholder="SUMMER2024"
                                            />
                                            <InputError message={errors.coupon_code} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="coupon_discount_type" value="Discount Type" />
                                            <select
                                                id="coupon_discount_type"
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                value={data.coupon_discount_type}
                                                onChange={(e) => setData('coupon_discount_type', e.target.value)}
                                            >
                                                <option value="percentage">Percentage</option>
                                                <option value="fixed">Fixed Amount</option>
                                            </select>
                                            <InputError message={errors.coupon_discount_type} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <InputLabel htmlFor="coupon_discount_value" value={`Discount Value ${data.coupon_discount_type === 'percentage' ? '(%)' : '(USD)'}`} />
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">
                                                    {data.coupon_discount_type === 'percentage' ? '%' : '$'}
                                                </span>
                                            </div>
                                            <input
                                                id="coupon_discount_value"
                                                type="number"
                                                step={data.coupon_discount_type === 'percentage' ? '1' : '0.01'}
                                                min="0"
                                                max={data.coupon_discount_type === 'percentage' ? '100' : undefined}
                                                className="mt-1 block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                value={data.coupon_discount_value}
                                                onChange={(e) => setData('coupon_discount_value', e.target.value)}
                                                placeholder={data.coupon_discount_type === 'percentage' ? '20' : '10.00'}
                                            />
                                        </div>
                                        <InputError message={errors.coupon_discount_value} className="mt-2" />
                                    </div>

                                    {/* Price Preview */}
                                    {data.price && data.coupon_code && data.coupon_discount_value && (
                                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                                            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Price Preview</h4>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Original Price:</span>
                                                    <span>${parseFloat(data.price).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                                    <span>Discount ({data.coupon_discount_value}{data.coupon_discount_type === 'percentage' ? '%' : '$'}):</span>
                                                    <span>
                                                        -${data.coupon_discount_type === 'percentage'
                                                            ? (data.price * data.coupon_discount_value / 100).toFixed(2)
                                                            : parseFloat(data.coupon_discount_value).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between font-medium border-t pt-1">
                                                    <span>Final Price:</span>
                                                    <span>${calculateDiscountedPrice().toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end">
                                    <SecondaryButton type="button" onClick={() => window.history.back()}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Save Pricing
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}