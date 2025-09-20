import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, DollarSign, User, CreditCard, Clock } from 'lucide-react';

export default function WithdrawalsQueue({ withdrawals }) {
    const [pendingWithdrawals, setPendingWithdrawals] = useState(withdrawals.data || []);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [reviewNote, setReviewNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleApprove = async (withdrawalId) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/withdrawals/${withdrawalId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ notes: reviewNote })
            });

            if (response.ok) {
                setPendingWithdrawals(pendingWithdrawals.filter(w => w.id !== withdrawalId));
                setSelectedWithdrawal(null);
                setReviewNote('');
                alert('Withdrawal approved successfully!');
            }
        } catch (error) {
            console.error('Error approving withdrawal:', error);
        }
        setLoading(false);
    };

    const handleDecline = async (withdrawalId) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/withdrawals/${withdrawalId}/decline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ notes: reviewNote })
            });

            if (response.ok) {
                setPendingWithdrawals(pendingWithdrawals.filter(w => w.id !== withdrawalId));
                setSelectedWithdrawal(null);
                setReviewNote('');
                alert('Withdrawal declined successfully!');
            }
        } catch (error) {
            console.error('Error declining withdrawal:', error);
        }
        setLoading(false);
    };

    const getMethodIcon = (method) => {
        switch (method) {
            case 'paypal': return '🅿️';
            case 'bank_transfer': return '🏦';
            case 'stripe': return '💳';
            default: return '💰';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Withdrawal Request Queue
                </h2>
            }
        >
            <Head title="Withdrawal Request Queue" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Queue List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium mb-4 flex items-center">
                                        <Clock className="h-5 w-5 mr-2 text-orange-500" />
                                        Pending Withdrawal Requests ({pendingWithdrawals.length})
                                    </h3>

                                    <div className="space-y-4">
                                        {pendingWithdrawals.length === 0 ? (
                                            <div className="text-center py-8">
                                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400">No withdrawal requests pending!</p>
                                            </div>
                                        ) : (
                                            pendingWithdrawals.map((withdrawal) => (
                                                <div
                                                    key={withdrawal.id}
                                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                        selectedWithdrawal?.id === withdrawal.id
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => setSelectedWithdrawal(withdrawal)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center mb-2">
                                                                <div className="text-2xl mr-3">
                                                                    {getMethodIcon(withdrawal.method)}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {withdrawal.instructor?.name || 'Unknown Instructor'}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {withdrawal.method.replace('_', ' ')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                                <DollarSign className="h-4 w-4 mr-1" />
                                                                Amount: ${withdrawal.amount}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                <Clock className="h-4 w-4 mr-1" />
                                                                Requested: {new Date(withdrawal.created_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                Pending
                                                            </span>
                                                        </div>
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
                                    {selectedWithdrawal ? (
                                        <>
                                            <h3 className="text-lg font-medium mb-4">Review Withdrawal</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                        {selectedWithdrawal.instructor?.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Request ID: #{selectedWithdrawal.id}
                                                    </p>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium">Amount:</span>
                                                        <span className="text-lg font-bold text-green-600">
                                                            ${selectedWithdrawal.amount}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm">Method:</span>
                                                        <span className="text-sm font-medium">
                                                            {selectedWithdrawal.method.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm">Requested:</span>
                                                        <span className="text-sm">
                                                            {new Date(selectedWithdrawal.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {selectedWithdrawal.method === 'bank_transfer' && selectedWithdrawal.bank_details && (
                                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                                        <h5 className="text-sm font-medium mb-2">Bank Details:</h5>
                                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                                            {JSON.stringify(selectedWithdrawal.bank_details, null, 2)}
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Review Notes (Optional)
                                                    </label>
                                                    <textarea
                                                        value={reviewNote}
                                                        onChange={(e) => setReviewNote(e.target.value)}
                                                        placeholder="Add any notes about this withdrawal..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                        rows={4}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <button
                                                        onClick={() => handleApprove(selectedWithdrawal.id)}
                                                        disabled={loading}
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 flex items-center justify-center"
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Approve Withdrawal
                                                    </button>
                                                    <button
                                                        onClick={() => handleDecline(selectedWithdrawal.id)}
                                                        disabled={loading}
                                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 flex items-center justify-center"
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Decline Withdrawal
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Select a withdrawal to review
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