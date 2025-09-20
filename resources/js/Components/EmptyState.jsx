import { FileX, Search, Users, BookOpen, CreditCard } from 'lucide-react';

export default function EmptyState({
    icon: Icon = FileX,
    title = 'No data found',
    description = 'There are no items to display at the moment.',
    action
}) {
    return (
        <div className="text-center py-12">
            <Icon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
            </p>
            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
}

// Predefined empty states for common use cases
export function NoUsers({ action }) {
    return (
        <EmptyState
            icon={Users}
            title="No users found"
            description="There are no users registered yet."
            action={action}
        />
    );
}

export function NoCourses({ action }) {
    return (
        <EmptyState
            icon={BookOpen}
            title="No courses found"
            description="No courses have been created yet."
            action={action}
        />
    );
}

export function NoSearchResults({ searchTerm, action }) {
    return (
        <EmptyState
            icon={Search}
            title="No results found"
            description={`No results found for "${searchTerm}". Try adjusting your search terms.`}
            action={action}
        />
    );
}

export function NoPayments({ action }) {
    return (
        <EmptyState
            icon={CreditCard}
            title="No payments found"
            description="There are no payment records yet."
            action={action}
        />
    );
}