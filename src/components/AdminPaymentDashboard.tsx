import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../utils/apiFetch';

interface Payment {
    _id: string;
    type: 'enrollment' | 'contribution';
    transaction_code: string;
    payment_status: string;
    createdAt: string;
    user_id: {
        name: string;
        email: string;
    };
    course_id?: {
        title: string;
        price: number;
    };
    project_id?: {
        title: string;
    };
    amount?: number;
}

interface PendingPaymentsResponse {
    enrollments: Payment[];
    contributions: Payment[];
}

const AdminPaymentDashboard: React.FC = () => {
    const { showToast } = useToast();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiFetch('/admin/pending-payments') as PendingPaymentsResponse;
            const enrollments = response.enrollments.map((e) => ({ ...e, type: 'enrollment' as const }));
            const contributions = response.contributions.map((c) => ({ ...c, type: 'contribution' as const }));

            setPayments([...enrollments, ...contributions].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
        } catch (error) {
            console.error('Error fetching payments:', error);
            showToast('Failed to fetch pending payments', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleApprove = async (paymentId: string, type: string) => {
        if (!confirmed) {
            showToast('Please confirm you received the payment', 'warning');
            return;
        }

        try {
            await apiFetch('/admin/approve-payment', {
                method: 'POST',
                body: JSON.stringify({ id: paymentId, type })
            });

            showToast('Payment approved successfully', 'success');
            setVerifyingId(null);
            setConfirmed(false);
            fetchPayments(); // Refresh list
        } catch (error) {
            console.error('Error approving payment:', error);
            showToast('Failed to approve payment', 'error');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Approvals</h1>
                <button
                    onClick={fetchPayments}
                    className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : payments.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No pending payments found.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {payments.map((payment) => (
                            <li key={payment._id} className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.type === 'enrollment' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {payment.type === 'enrollment' ? 'Course Purchase' : 'Donation'}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {payment.transaction_code}
                                        </h3>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400 mr-6">
                                                    User: {payment.user_id.name} ({payment.user_id.email})
                                                </p>
                                                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    Item: {payment.type === 'enrollment' ? payment.course_id?.title : payment.project_id?.title}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                                                Amount: KES {(payment.type === 'enrollment' ? payment.course_id?.price : payment.amount)?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-6 flex items-center">
                                        {verifyingId === payment._id ? (
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                                                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3 font-medium flex items-center">
                                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                                    Safety Check
                                                </p>
                                                <label className="flex items-start space-x-2 mb-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={confirmed}
                                                        onChange={(e) => setConfirmed(e.target.checked)}
                                                        className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-xs text-gray-700 dark:text-gray-300">
                                                        I confirm I received <strong>KES {(payment.type === 'enrollment' ? payment.course_id?.price : payment.amount)?.toLocaleString()}</strong> with code <strong>{payment.transaction_code}</strong>.
                                                    </span>
                                                </label>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleApprove(payment._id, payment.type)}
                                                        disabled={!confirmed}
                                                        className="flex-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setVerifyingId(null);
                                                            setConfirmed(false);
                                                        }}
                                                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setVerifyingId(payment._id)}
                                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Verify &amp; Approve
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentDashboard;
