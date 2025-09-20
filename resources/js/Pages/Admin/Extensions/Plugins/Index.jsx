import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    Upload,
    Settings,
    Play,
    Square,
    Trash2,
    Eye,
    Download,
    Package,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Zap
} from 'lucide-react';

export default function Index({ plugins }) {
    const [allPlugins, setAllPlugins] = useState(plugins || []);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedPlugin, setSelectedPlugin] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('plugin', file);

        try {
            const response = await fetch('/admin/extensions/plugins/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                const result = await response.json();
                setAllPlugins(prev => [...prev, result.plugin]);
                setUploadProgress(100);
                alert('Plugin uploaded successfully!');
            } else {
                const error = await response.json();
                alert(error.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
            event.target.value = '';
        }
    };

    const handleActivate = async (pluginId) => {
        try {
            const response = await fetch(`/admin/extensions/plugins/${pluginId}/activate`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                const result = await response.json();
                setAllPlugins(prev => prev.map(p =>
                    p.id === pluginId ? result.plugin : p
                ));
                alert('Plugin activated successfully!');
            } else {
                const error = await response.json();
                alert(error.error || 'Activation failed');
            }
        } catch (error) {
            console.error('Activation error:', error);
            alert('Activation failed');
        }
    };

    const handleDeactivate = async (pluginId) => {
        try {
            const response = await fetch(`/admin/extensions/plugins/${pluginId}/deactivate`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                const result = await response.json();
                setAllPlugins(prev => prev.map(p =>
                    p.id === pluginId ? result.plugin : p
                ));
                alert('Plugin deactivated successfully!');
            }
        } catch (error) {
            console.error('Deactivation error:', error);
            alert('Deactivation failed');
        }
    };

    const handleDelete = async (pluginId) => {
        if (!confirm('Are you sure you want to delete this plugin? This action cannot be undone.')) return;

        try {
            const response = await fetch(`/admin/extensions/plugins/${pluginId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                setAllPlugins(prev => prev.filter(p => p.id !== pluginId));
                alert('Plugin deleted successfully!');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Delete failed');
        }
    };

    const getStatusIcon = (plugin) => {
        if (plugin.status === 'error') {
            return <AlertTriangle className="h-5 w-5 text-red-500" />;
        } else if (plugin.is_active) {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        } else if (plugin.status === 'installed') {
            return <Package className="h-5 w-5 text-blue-500" />;
        } else {
            return <XCircle className="h-5 w-5 text-gray-400" />;
        }
    };

    const getStatusColor = (plugin) => {
        if (plugin.status === 'error') return 'border-red-200 bg-red-50';
        if (plugin.is_active) return 'border-green-200 bg-green-50';
        if (plugin.status === 'installed') return 'border-blue-200 bg-blue-50';
        return 'border-gray-200 bg-gray-50';
    };

    const activePlugins = allPlugins.filter(p => p.is_active);
    const inactivePlugins = allPlugins.filter(p => !p.is_active && p.status === 'installed');
    const otherPlugins = allPlugins.filter(p => p.status !== 'installed' || (!p.is_active && p.status !== 'installed'));

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Plugins Management
                </h2>
            }
        >
            <Head title="Plugins Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Upload Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium">Upload Plugin</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Upload a plugin package (.zip) to install it
                                    </p>
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {uploading ? 'Uploading...' : 'Upload Plugin'}
                                </button>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".zip"
                                onChange={handleFileUpload}
                                className="hidden"
                            />

                            {uploading && (
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">Installing plugin...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Plugins</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{activePlugins.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactive Plugins</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{inactivePlugins.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Zap className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Plugins</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{allPlugins.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Plugins */}
                    {activePlugins.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                    Active Plugins ({activePlugins.length})
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activePlugins.map((plugin) => (
                                        <div key={plugin.id} className={`border rounded-lg p-4 ${getStatusColor(plugin)}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center">
                                                    {getStatusIcon(plugin)}
                                                    <div className="ml-3">
                                                        <h4 className="font-medium">{plugin.name}</h4>
                                                        <p className="text-sm text-gray-600">v{plugin.version}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                                {plugin.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleDeactivate(plugin.id)}
                                                        className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                                                    >
                                                        Deactivate
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedPlugin(plugin)}
                                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                    >
                                                        <Settings className="h-3 w-3 inline mr-1" />
                                                        Settings
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inactive Plugins */}
                    {inactivePlugins.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium flex items-center">
                                    <Package className="h-5 w-5 text-blue-500 mr-2" />
                                    Inactive Plugins ({inactivePlugins.length})
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {inactivePlugins.map((plugin) => (
                                        <div key={plugin.id} className={`border rounded-lg p-4 ${getStatusColor(plugin)}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center">
                                                    {getStatusIcon(plugin)}
                                                    <div className="ml-3">
                                                        <h4 className="font-medium">{plugin.name}</h4>
                                                        <p className="text-sm text-gray-600">v{plugin.version}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                                {plugin.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleActivate(plugin.id)}
                                                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                                    >
                                                        Activate
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(plugin.id)}
                                                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other Plugins (Errors, etc.) */}
                    {otherPlugins.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium flex items-center">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                                    Other Plugins ({otherPlugins.length})
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {otherPlugins.map((plugin) => (
                                        <div key={plugin.id} className={`border rounded-lg p-4 ${getStatusColor(plugin)}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center">
                                                    {getStatusIcon(plugin)}
                                                    <div className="ml-3">
                                                        <h4 className="font-medium">{plugin.name}</h4>
                                                        <p className="text-sm text-gray-600">v{plugin.version}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                                {plugin.description}
                                            </p>

                                            <div className="text-xs text-red-600">
                                                {plugin.status === 'error' ? 'Installation failed' : 'Uninstalled'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {allPlugins.length === 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="text-center py-12">
                                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No plugins installed
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Upload your first plugin to extend the functionality of your LMS
                                </p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Plugin
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}