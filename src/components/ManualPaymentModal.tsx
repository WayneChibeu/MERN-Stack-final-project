import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

interface ManualPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    phoneNumber: string; // The admin's phone number
    onSubmit: (transactionCode: string) => Promise<void>;
    title: string;
}

const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({
    isOpen,
    onClose,
    amount,
    phoneNumber,
    onSubmit,
    title
}) => {
    const [transactionCode, setTransactionCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transactionCode.trim()) {
            setError('Please enter the transaction code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSubmit(transactionCode);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setTransactionCode('');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to submit payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {success ? (
                        <div className="text-center py-8">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Payment Submitted!</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Your transaction code has been received. Access will be granted once the admin approves it.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            Send <strong>KES {amount.toLocaleString()}</strong> to <strong>{phoneNumber}</strong> via M-Pesa.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="transactionCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        M-Pesa Transaction Code
                                    </label>
                                    <input
                                        type="text"
                                        id="transactionCode"
                                        value={transactionCode}
                                        onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                                        placeholder="e.g. QKH1234567"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                        maxLength={10}
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'I Have Paid'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManualPaymentModal;
