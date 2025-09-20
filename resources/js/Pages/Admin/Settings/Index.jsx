import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Settings, Globe, Mail, CreditCard, Cloud, Database, Save, RefreshCw } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ settings }) {
    const [activeTab, setActiveTab] = useState('site');
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        settings: {}
    });

    useEffect(() => {
        // Initialize form data from settings prop
        const initialData = {};
        Object.keys(settings).forEach(group => {
            settings[group].forEach(setting => {
                initialData[setting.key] = setting.value || '';
            });
        });
        setData('settings', initialData);
    }, [settings]);

    const tabs = [
        { id: 'site', label: 'Site Settings', icon: Globe },
        { id: 'email', label: 'Email Settings', icon: Mail },
        { id: 'payments', label: 'Payment Settings', icon: CreditCard },
        { id: 's3', label: 'S3 Settings', icon: Cloud },
        { id: 'cache', label: 'Cache Settings', icon: Database },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const settingsArray = Object.keys(data.settings).map(key => {
            const setting = Object.values(settings).flat().find(s => s.key === key);
            return {
                key: key,
                value: data.settings[key],
                group: setting ? setting.group : 'general'
            };
        });

        put(route('admin.settings.update'), {
            data: { settings: settingsArray },
            onSuccess: () => {
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    const handleInitializeDefaults = () => {
        if (confirm('This will initialize default settings. Continue?')) {
            setIsLoading(true);
            fetch(route('admin.settings.initialize'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            })
            .then(response => response.json())
            .then(() => {
                setIsLoading(false);
                window.location.reload();
            })
            .catch(() => {
                setIsLoading(false);
            });
        }
    };

    const renderTabContent = () => {
        const currentSettings = settings[activeTab] || [];

        return (
            <div className="space-y-6">
                {currentSettings.length === 0 ? (
                    <div className="text-center py-12" role="status" aria-live="polite">
                        <Settings className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            No settings found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Settings for this section haven't been configured yet.
                        </p>
                        <div className="mt-6">
                            <SecondaryButton onClick={handleInitializeDefaults} aria-describedby="initialize-help">
                                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                                Initialize Default Settings
                            </SecondaryButton>
                            <div id="initialize-help" className="sr-only">Initialize default settings for all configuration groups</div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2" role="group" aria-labelledby={`${activeTab}-settings-heading`}>
                        <h2 id={`${activeTab}-settings-heading`} className="sr-only">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h2>
                        {currentSettings.map((setting) => {
                            const labelText = setting.label || setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            const inputId = `setting-${setting.key}`;
                            const helpId = `help-${setting.key}`;

                            return (
                                <div key={setting.key} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" role="group" aria-labelledby={inputId}>
                                    <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {labelText}
                                    </label>

                                    {setting.type === 'textarea' ? (
                                        <textarea
                                            id={inputId}
                                            value={data.settings[setting.key] || ''}
                                            onChange={(e) => setData('settings', { ...data.settings, [setting.key]: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                            rows={3}
                                            placeholder={setting.description || ''}
                                            aria-describedby={setting.description ? helpId : undefined}
                                        />
                                    ) : setting.type === 'boolean' ? (
                                        <div className="flex items-center">
                                            <input
                                                id={inputId}
                                                type="checkbox"
                                                checked={data.settings[setting.key] === 'true' || data.settings[setting.key] === true}
                                                onChange={(e) => setData('settings', { ...data.settings, [setting.key]: e.target.checked ? 'true' : 'false' })}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                                aria-describedby={setting.description ? helpId : undefined}
                                            />
                                            <label htmlFor={inputId} className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                                {setting.description || 'Enable this setting'}
                                            </label>
                                        </div>
                                    ) : (
                                        <input
                                            id={inputId}
                                            type={setting.type === 'email' ? 'email' : setting.type === 'password' ? 'password' : setting.type === 'number' ? 'number' : 'text'}
                                            value={data.settings[setting.key] || ''}
                                            onChange={(e) => setData('settings', { ...data.settings, [setting.key]: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                            placeholder={setting.description || ''}
                                            aria-describedby={setting.description ? helpId : undefined}
                                        />
                                    )}

                                    {setting.description && (
                                        <p id={helpId} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {setting.description}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Settings
                </h2>
            }
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <nav className="-mb-px flex space-x-8" aria-label="Settings sections" role="tablist">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                id={`tab-${tab.id}`}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                    isActive
                                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                                }`}
                                                role="tab"
                                                aria-selected={isActive}
                                                aria-controls={`panel-${tab.id}`}
                                                tabIndex={isActive ? 0 : -1}
                                            >
                                                <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="mt-6" role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
                                {renderTabContent()}
                            </div>

                            {/* Actions */}
                            {Object.keys(settings).length > 0 && (
                                <div className="mt-8 flex justify-between items-center" role="group" aria-label="Settings actions">
                                    <SecondaryButton
                                        onClick={handleInitializeDefaults}
                                        disabled={isLoading}
                                        aria-describedby="reset-help"
                                    >
                                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                                        Reset to Defaults
                                    </SecondaryButton>
                                    <div id="reset-help" className="sr-only">Reset all settings to their default values</div>

                                    <PrimaryButton
                                        onClick={handleSubmit}
                                        disabled={processing || isLoading}
                                        aria-describedby="save-help"
                                    >
                                        <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                                        {processing ? 'Saving...' : 'Save Settings'}
                                    </PrimaryButton>
                                    <div id="save-help" className="sr-only">Save the current settings configuration</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}