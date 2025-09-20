export default function SkeletonLoader({ className = '', lines = 1 }) {
    const skeletonLines = Array.from({ length: lines }, (_, i) => (
        <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            {i === lines - 1 && <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>}
        </div>
    ));

    return (
        <div className={`space-y-4 ${className}`}>
            {skeletonLines}
        </div>
    );
}

// Table skeleton loader
export function TableSkeletonLoader({ rows = 5, columns = 4 }) {
    return (
        <div className="animate-pulse">
            {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex space-x-4 py-4 border-b border-gray-200 dark:border-gray-700">
                    {Array.from({ length: columns }, (_, colIndex) => (
                        <div key={colIndex} className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

// Card skeleton loader
export function CardSkeletonLoader({ count = 3 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                    <div className="mt-4 h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
            ))}
        </div>
    );
}

// Settings skeleton loader
export function SettingsSkeletonLoader({ count = 6 }) {
    return (
        <div className="animate-pulse space-y-6">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
}