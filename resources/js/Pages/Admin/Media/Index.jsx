import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import {
    Upload,
    Search,
    Grid,
    List,
    Folder,
    Image as ImageIcon,
    Video,
    FileText,
    Music,
    MoreVertical,
    Download,
    Edit,
    Trash2,
    CheckSquare,
    Square,
    Filter
} from 'lucide-react';

export default function Index({ media }) {
    const [files, setFiles] = useState(media.data || []);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [filterType, setFilterType] = useState('all');
    const fileInputRef = useRef(null);

    const handleFileUpload = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files[]', file);
        });
        formData.append('collection', 'admin');
        formData.append('folder', '/');

        try {
            const response = await fetch('/admin/media', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                const result = await response.json();
                setFiles(prev => [...result.files, ...prev]);
                setUploadProgress(100);
                alert('Files uploaded successfully!');
            } else {
                throw new Error('Upload failed');
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

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            // Simulate file input change
            const fakeEvent = { target: { files: droppedFiles } };
            handleFileUpload(fakeEvent);
        }
    };

    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            file.file_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || file.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleSelectFile = (fileId) => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };

    const handleSelectAll = () => {
        if (selectedFiles.length === filteredFiles.length) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(filteredFiles.map(file => file.id));
        }
    };

    const handleDeleteSelected = async () => {
        if (!selectedFiles.length) return;

        if (!confirm(`Delete ${selectedFiles.length} selected file(s)?`)) return;

        try {
            const response = await fetch('/admin/media/bulk-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ ids: selectedFiles })
            });

            if (response.ok) {
                setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
                setSelectedFiles([]);
                alert('Files deleted successfully!');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Delete failed. Please try again.');
        }
    };

    const getFileIcon = (type, mimeType) => {
        switch (type) {
            case 'image': return <ImageIcon className="h-8 w-8 text-blue-500" />;
            case 'video': return <Video className="h-8 w-8 text-red-500" />;
            case 'audio': return <Music className="h-8 w-8 text-green-500" />;
            case 'document': return <FileText className="h-8 w-8 text-orange-500" />;
            default: return <FileText className="h-8 w-8 text-gray-500" />;
        }
    };

    const FileCard = ({ file }) => (
        <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
            selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        }`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => handleSelectFile(file.id)}
                        className="mr-3"
                    />
                    {file.type === 'image' ? (
                        <img
                            src={file.url}
                            alt={file.alt_text || file.name}
                            className="w-12 h-12 object-cover rounded"
                        />
                    ) : (
                        getFileIcon(file.type, file.mime_type)
                    )}
                </div>
                <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <h4 className="font-medium text-sm mb-1 truncate" title={file.name}>
                {file.name}
            </h4>
            <p className="text-xs text-gray-500 mb-2">{file.size_for_humans}</p>
            <p className="text-xs text-gray-400">
                {new Date(file.created_at).toLocaleDateString()}
            </p>
        </div>
    );

    const FileRow = ({ file }) => (
        <tr className={selectedFiles.includes(file.id) ? 'bg-blue-50' : ''}>
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleSelectFile(file.id)}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    {file.type === 'image' ? (
                        <img
                            src={file.url}
                            alt={file.alt_text || file.name}
                            className="w-8 h-8 object-cover rounded mr-3"
                        />
                    ) : (
                        <div className="mr-3">
                            {getFileIcon(file.type, file.mime_type)}
                        </div>
                    )}
                    <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-gray-500">{file.file_name}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {file.type}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {file.size_for_humans}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(file.created_at).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Download className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-4 w-4" />
                </button>
            </td>
        </tr>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Media Manager
                </h2>
            }
        >
            <Head title="Media Manager" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Upload Area */}
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center hover:border-gray-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            Drop files here or click to upload
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Support for images, videos, documents, and more
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Choose Files'}
                        </button>
                        {uploading && (
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{uploadProgress}% uploaded</p>
                            </div>
                        )}
                    </div>

                    {/* Toolbar */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search files..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="image">Images</option>
                                <option value="video">Videos</option>
                                <option value="audio">Audio</option>
                                <option value="document">Documents</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleSelectAll}
                                className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                {selectedFiles.length === filteredFiles.length && filteredFiles.length > 0 ? (
                                    <CheckSquare className="h-4 w-4 mr-2" />
                                ) : (
                                    <Square className="h-4 w-4 mr-2" />
                                )}
                                Select All
                            </button>

                            {selectedFiles.length > 0 && (
                                <button
                                    onClick={handleDeleteSelected}
                                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete ({selectedFiles.length})
                                </button>
                            )}

                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    <Grid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Files Display */}
                    {filteredFiles.length === 0 ? (
                        <div className="text-center py-12">
                            <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {files.length === 0 ? 'No files uploaded yet' : 'No files match your search'}
                            </h3>
                            <p className="text-gray-500">
                                {files.length === 0 ? 'Upload your first file to get started' : 'Try adjusting your search or filters'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    {filteredFiles.map((file) => (
                                        <FileCard key={file.id} file={file} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                                                        onChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    File
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Size
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Uploaded
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredFiles.map((file) => (
                                                <FileRow key={file.id} file={file} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}