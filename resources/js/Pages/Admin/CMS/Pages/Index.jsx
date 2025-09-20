import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
    Plus,
    Edit,
    Eye,
    Trash2,
    Save,
    FileText,
    Calendar,
    User,
    Search,
    Filter,
    Image as ImageIcon,
    Settings
} from 'lucide-react';

export default function Index({ pages }) {
    const [allPages, setAllPages] = useState(pages.data || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedPage, setSelectedPage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        status: 'draft',
        template: 'default',
        featured_image: '',
        seo_meta: {
            title: '',
            description: '',
            keywords: ''
        },
        published_at: ''
    });

    const filteredPages = allPages.filter(page => {
        const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            page.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreatePage = () => {
        setSelectedPage(null);
        setFormData({
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            status: 'draft',
            template: 'default',
            featured_image: '',
            seo_meta: {
                title: '',
                description: '',
                keywords: ''
            },
            published_at: ''
        });
        setEditorState(EditorState.createEmpty());
        setIsEditing(true);
    };

    const handleEditPage = (page) => {
        setSelectedPage(page);
        setFormData({
            title: page.title,
            slug: page.slug,
            content: page.content,
            excerpt: page.excerpt || '',
            status: page.status,
            template: page.template,
            featured_image: page.featured_image || '',
            seo_meta: page.seo_meta || {
                title: '',
                description: '',
                keywords: ''
            },
            published_at: page.published_at ? page.published_at.split('T')[0] : ''
        });

        // Convert HTML to editor state
        if (page.content) {
            const blocksFromHTML = htmlToDraft(page.content);
            const contentState = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );
            setEditorState(EditorState.createWithContent(contentState));
        } else {
            setEditorState(EditorState.createEmpty());
        }

        setIsEditing(true);
    };

    const handleSavePage = async () => {
        const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        const pageData = {
            ...formData,
            content: content
        };

        try {
            const url = selectedPage
                ? `/admin/cms/pages/${selectedPage.id}`
                : '/admin/cms/pages';

            const method = selectedPage ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(pageData)
            });

            if (response.ok) {
                const result = await response.json();

                if (selectedPage) {
                    setAllPages(prev => prev.map(p => p.id === selectedPage.id ? result.page : p));
                } else {
                    setAllPages(prev => [result.page, ...prev]);
                }

                setIsEditing(false);
                alert('Page saved successfully!');
            } else {
                const error = await response.json();
                alert(error.message || 'Error saving page');
            }
        } catch (error) {
            console.error('Error saving page:', error);
            alert('Error saving page');
        }
    };

    const handleDeletePage = async (pageId) => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            const response = await fetch(`/admin/cms/pages/${pageId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                setAllPages(prev => prev.filter(p => p.id !== pageId));
                alert('Page deleted successfully!');
            } else {
                const error = await response.json();
                alert(error.message || 'Error deleting page');
            }
        } catch (error) {
            console.error('Error deleting page:', error);
            alert('Error deleting page');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    };

    if (isEditing) {
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {selectedPage ? 'Edit Page' : 'Create New Page'}
                        </h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSavePage}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Page
                            </button>
                        </div>
                    </div>
                }
            >
                <Head title={selectedPage ? 'Edit Page' : 'Create Page'} />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Page Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                            placeholder="Enter page title"
                                        />
                                    </div>

                                    {/* Slug */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            URL Slug
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                            placeholder="page-url-slug"
                                        />
                                    </div>

                                    {/* Content Editor */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Content *
                                        </label>
                                        <div className="border border-gray-300 rounded-md">
                                            <Editor
                                                editorState={editorState}
                                                onEditorStateChange={onEditorStateChange}
                                                toolbar={{
                                                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                                                    inline: { inDropdown: true },
                                                    list: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    link: { inDropdown: true },
                                                }}
                                                editorClassName="px-4 py-2 min-h-96 dark:bg-gray-700 dark:text-gray-100"
                                            />
                                        </div>
                                    </div>

                                    {/* Excerpt */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Excerpt
                                        </label>
                                        <textarea
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                            rows={3}
                                            placeholder="Brief description of the page"
                                        />
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Status & Settings */}
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium mb-4">Publishing</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Status
                                                </label>
                                                <select
                                                    value={formData.status}
                                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                                                >
                                                    <option value="draft">Draft</option>
                                                    <option value="published">Published</option>
                                                    <option value="scheduled">Scheduled</option>
                                                </select>
                                            </div>

                                            {formData.status === 'scheduled' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Publish Date
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        value={formData.published_at}
                                                        onChange={(e) => setFormData({...formData, published_at: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                                                    />
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Template
                                                </label>
                                                <select
                                                    value={formData.template}
                                                    onChange={(e) => setFormData({...formData, template: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                                                >
                                                    <option value="default">Default</option>
                                                    <option value="full-width">Full Width</option>
                                                    <option value="sidebar">With Sidebar</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Featured Image */}
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium mb-4">Featured Image</h3>
                                        <input
                                            type="text"
                                            value={formData.featured_image}
                                            onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                                            placeholder="Image URL"
                                        />
                                    </div>

                                    {/* SEO Settings */}
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium mb-4">SEO Settings</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    SEO Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.seo_meta.title}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        seo_meta: {...formData.seo_meta, title: e.target.value}
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                                                    placeholder="Custom SEO title"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Meta Description
                                                </label>
                                                <textarea
                                                    value={formData.seo_meta.description}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        seo_meta: {...formData.seo_meta, description: e.target.value}
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                                                    rows={3}
                                                    placeholder="SEO description"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Keywords
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.seo_meta.keywords}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        seo_meta: {...formData.seo_meta, keywords: e.target.value}
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500"
                                                    placeholder="keyword1, keyword2, keyword3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Pages Management
                </h2>
            }
        >
            <Head title="Pages Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Toolbar */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search pages..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                        <option value="scheduled">Scheduled</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleCreatePage}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Page
                                </button>
                            </div>

                            {/* Pages List */}
                            <div className="space-y-4">
                                {filteredPages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No pages found
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            {allPages.length === 0 ? 'Create your first page to get started' : 'Try adjusting your search or filters'}
                                        </p>
                                        {allPages.length === 0 && (
                                            <button
                                                onClick={handleCreatePage}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create First Page
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    filteredPages.map((page) => (
                                        <div
                                            key={page.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                            {page.title}
                                                        </h4>
                                                        <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(page.status)}`}>
                                                            {page.status}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                                        <span className="mr-4">/{page.slug}</span>
                                                        <User className="h-4 w-4 mr-1" />
                                                        {page.author?.name}
                                                        <Calendar className="h-4 w-4 ml-4 mr-1" />
                                                        {new Date(page.created_at).toLocaleDateString()}
                                                    </div>

                                                    {page.excerpt && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                            {page.excerpt}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-2 ml-4">
                                                    <button
                                                        onClick={() => handleEditPage(page)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                                                        title="Edit page"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 text-green-600 hover:bg-green-100 rounded"
                                                        title="Preview page"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePage(page.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                                                        title="Delete page"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}