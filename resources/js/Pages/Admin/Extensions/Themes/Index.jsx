import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import {
    Upload,
    Palette,
    Eye,
    Settings,
    Trash2,
    Download,
    Image as ImageIcon,
    CheckCircle,
    Package,
    Zap,
    Star
} from 'lucide-react';

export default function Index({ themes, activeTheme }) {
    const [allThemes, setAllThemes] = useState(themes || []);
    const [currentActiveTheme, setCurrentActiveTheme] = useState(activeTheme);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [showCustomizer, setShowCustomizer] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('theme', file);

        try {
            const response = await fetch('/admin/extensions/themes/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                const result = await response.json();
                setAllThemes(prev => [...prev, result.theme]);
                setUploadProgress(100);
                alert('Theme uploaded successfully!');
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

    const handleActivate = async (themeId) => {
        try {
            const response = await fetch(`/admin/extensions/themes/${themeId}/activate`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                const result = await response.json();
                setAllThemes(prev => prev.map(t =>
                    t.id === themeId ? result.theme : {...t, is_active: false}
                ));
                setCurrentActiveTheme(result.theme);
                alert('Theme activated successfully!');
            } else {
                const error = await response.json();
                alert(error.error || 'Activation failed');
            }
        } catch (error) {
            console.error('Activation error:', error);
            alert('Activation failed');
        }
    };

    const handleDelete = async (themeId) => {
        if (!confirm('Are you sure you want to delete this theme? This action cannot be undone.')) return;

        try {
            const response = await fetch(`/admin/extensions/themes/${themeId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                setAllThemes(prev => prev.filter(t => t.id !== themeId));
                if (currentActiveTheme?.id === themeId) {
                    setCurrentActiveTheme(null);
                }
                alert('Theme deleted successfully!');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Delete failed');
        }
    };

    const handlePreview = async (theme) => {
        try {
            const response = await fetch(`/admin/extensions/themes/${theme.id}/preview`);
            if (response.ok) {
                const result = await response.json();
                window.open(result.preview_url, '_blank');
            }
        } catch (error) {
            console.error('Preview error:', error);
            alert('Preview failed');
        }
    };

    const getStatusIcon = (theme) => {
        if (theme.is_active) {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        } else if (theme.status === 'installed') {
            return <Package className="h-5 w-5 text-blue-500" />;
        } else {
            return <ImageIcon className="h-5 w-5 text-gray-400" />;
        }
    };

    const activeThemes = allThemes.filter(t => t.is_active);
    const inactiveThemes = allThemes.filter(t => !t.is_active && t.status === 'installed');
    const otherThemes = allThemes.filter(t => t.status !== 'installed' || (!t.is_active && t.status !== 'installed'));

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Themes Management
                </h2>
            }
        >
            <Head title="Themes Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Upload Section */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium">Upload Theme</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Upload a theme package (.zip) to install it
                                    </p>
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {uploading ? 'Uploading...' : 'Upload Theme'}
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
                                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">Installing theme...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Current Active Theme */}
                    {currentActiveTheme && (
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                                    <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Active Theme: {currentActiveTheme.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Version {currentActiveTheme.version} by {currentActiveTheme.author}
                                    </p>
                                </div>
                                <div className="ml-auto flex space-x-2">
                                    <button
                                        onClick={() => handlePreview(currentActiveTheme)}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                    >
                                        <Eye className="h-4 w-4 inline mr-1" />
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => setShowCustomizer(true)}
                                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                                    >
                                        <Settings className="h-4 w-4 inline mr-1" />
                                        Customize
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Theme</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {activeThemes.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Installed Themes</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {allThemes.filter(t => t.status === 'installed').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                                    <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Themes</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{allThemes.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available Themes */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium flex items-center">
                                <Palette className="h-5 w-5 text-purple-500 mr-2" />
                                Available Themes
                            </h3>
                        </div>
                        <div className="p-6">
                            {allThemes.length === 0 ? (
                                <div className="text-center py-12">
                                    <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No themes installed
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Upload your first theme to customize your LMS appearance
                                    </p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Theme
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {allThemes.map((theme) => (
                                        <div
                                            key={theme.id}
                                            className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                                                theme.is_active
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-200'
                                                    : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                        >
                                            {/* Theme Preview Image */}
                                            <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                                                {theme.screenshot_urls && theme.screenshot_urls.length > 0 ? (
                                                    <img
                                                        src={theme.screenshot_urls[0]}
                                                        alt={theme.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <ImageIcon className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                )}

                                                {theme.is_active && (
                                                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                                                        Active
                                                    </div>
                                                )}
                                            </div>

                                            {/* Theme Info */}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                            {theme.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            v{theme.version} by {theme.author}
                                                        </p>
                                                    </div>
                                                    {getStatusIcon(theme)}
                                                </div>

                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                                                    {theme.description}
                                                </p>

                                                {/* Theme Tags */}
                                                {theme.tag_list && theme.tag_list.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mb-4">
                                                        {theme.tag_list.slice(0, 3).map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex space-x-2">
                                                    {!theme.is_active && theme.status === 'installed' && (
                                                        <button
                                                            onClick={() => handleActivate(theme.id)}
                                                            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                                        >
                                                            Activate
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handlePreview(theme)}
                                                        className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>

                                                    {theme.is_active && (
                                                        <button
                                                            onClick={() => setShowCustomizer(true)}
                                                            className="px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleDelete(theme.id)}
                                                        className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}