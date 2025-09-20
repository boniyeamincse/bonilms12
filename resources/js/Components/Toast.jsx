import { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Allow time for exit animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
        error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200',
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200',
    };

    const Icon = icons[type];

    if (!isVisible) return null;

    return (
        <div
            className={`flex items-center p-4 mb-4 text-sm border rounded-lg transition-all duration-300 ${
                isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
            } ${colors[type]}`}
            role="alert"
            aria-live="assertive"
        >
            <Icon className="flex-shrink-0 w-5 h-5 mr-3" aria-hidden="true" />
            <div className="flex-1 font-medium">
                {message}
            </div>
            <button
                type="button"
                className="ml-3 text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 rounded-lg"
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                aria-label="Close notification"
            >
                <X className="w-5 h-5" aria-hidden="true" />
            </button>
        </div>
    );
};

export default Toast;