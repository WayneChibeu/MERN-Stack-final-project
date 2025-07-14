import React from 'react';
import { Toast, ToastType } from '../context/ToastContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const typeStyles: Record<ToastType, string> = {
  success: 'bg-green-100 border-green-500 text-green-800',
  error: 'bg-red-100 border-red-500 text-red-800',
  warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
  info: 'bg-blue-100 border-blue-500 text-blue-800',
};

const typeIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 mr-2 text-green-500" />,
  error: <XCircle className="w-5 h-5 mr-2 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />,
  info: <Info className="w-5 h-5 mr-2 text-blue-500" />,
};

interface ToastListProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const ToastList: React.FC<ToastListProps> = ({ toasts, removeToast }) => (
  <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`flex items-center border-l-4 p-4 rounded shadow-md min-w-[260px] max-w-xs cursor-pointer ${typeStyles[toast.type]}`}
        onClick={() => removeToast(toast.id)}
        role="alert"
      >
        {typeIcons[toast.type]}
        <span className="flex-1 text-sm font-medium">{toast.message}</span>
        <button
          className="ml-2 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={(e) => {
            e.stopPropagation();
            removeToast(toast.id);
          }}
          aria-label="Dismiss"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
);

export default ToastList; 