import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    ChevronDown,
    ChevronRight,
    Folder,
    FolderOpen,
    Search,
    CheckSquare,
    Square,
    MoreVertical,
    Eye,
    EyeOff
} from 'lucide-react';

export default function Index({ categories }) {
    const [allCategories, setAllCategories] = useState(categories || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parent_id: null,
        is_active: true
    });

    const filteredCategories = allCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleExpanded = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const handleSelectCategory = (categoryId, checked) => {
        if (checked) {
            setSelectedCategories(prev => [...prev, categoryId]);
        } else {
            setSelectedCategories(prev => prev.filter(id => id !== categoryId));
        }
    };

    const handleSelectAll = () => {
        if (selectedCategories.length === filteredCategories.length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(filteredCategories.map(cat => cat.id));
        }
    };

    const handleCreateCategory = async () => {
        try {
            const response = await fetch('/admin/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                setAllCategories(prev => [...prev, result.category]);
                setShowCreateForm(false);
                resetForm();
                alert('Category created successfully!');
            } else {
                const error = await response.json();
                alert(error.message || 'Error creating category');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Error creating category');
        }
    };

    const handleUpdateCategory = async () => {
        try {
            const response = await fetch(`/admin/categories/${editingCategory.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                setAllCategories(prev => prev.map(cat =>
                    cat.id === editingCategory.id ? result.category : cat
                ));
                setEditingCategory(null);
                resetForm();
                alert('Category updated successfully!');
            } else {
                const error = await response.json();
                alert(error.message || 'Error updating category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Error updating category');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await fetch(`/admin/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                setAllCategories(prev => prev.filter(cat => cat.id !== categoryId));
                alert('Category deleted successfully!');
            } else {
                const error = await response.json();
                alert(error.message || 'Error deleting category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error deleting category');
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedCategories.length) return;
        if (!confirm(`Delete ${selectedCategories.length} selected categories?`)) return;

        try {
            const response = await fetch('/admin/categories/bulk-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ ids: selectedCategories })
            });

            if (response.ok) {
                const result = await response.json();
                setAllCategories(prev => prev.filter(cat => !selectedCategories.includes(cat.id)));
                setSelectedCategories([]);
                alert(result.message);

                if (result.errors && result.errors.length > 0) {
                    alert('Some categories could not be deleted:\n' + result.errors.join('\n'));
                }
            } else {
                const error = await response.json();
                alert(error.message || 'Error deleting categories');
            }
        } catch (error) {
            console.error('Error deleting categories:', error);
            alert('Error deleting categories');
        }
    };

    const handleToggleActive = async (categoryId) => {
        try {
            const response = await fetch(`/admin/categories/${categoryId}/toggle-active`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                const result = await response.json();
                setAllCategories(prev => prev.map(cat =>
                    cat.id === categoryId ? result.category : cat
                ));
            } else {
                const error = await response.json();
                alert(error.message || 'Error toggling category status');
            }
        } catch (error) {
            console.error('Error toggling category status:', error);
            alert('Error toggling category status');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            parent_id: null,
            is_active: true
        });
    };

    const startEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            parent_id: category.parent_id,
            is_active: category.is_active
        });
    };

    const renderCategoryTree = (categories, level = 0) => {
        return categories
            .filter(cat => !cat.parent_id)
            .sort((a, b) => a.order - b.order)
            .map(category => (
                <div key={category.id}>
                    <div
                        className={`flex items-center py-3 px-4 border-b border-gray-200 hover:bg-gray-50 ${
                            selectedCategories.includes(category.id) ? 'bg-blue-50' : ''
                        }`}
                        style={{ paddingLeft: `${16 + level * 24}px` }}
                    >
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={(e) => handleSelectCategory(category.id, e.target.checked)}
                            className="mr-3"
                        />

                        <div className="flex items-center mr-3">
                            {category.children && category.children.length > 0 ? (
                                <button
                                    onClick={() => toggleExpanded(category.id)}
                                    className="mr-2 text-gray-400 hover:text-gray-600"
                                >
                                    {expandedCategories.has(category.id) ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </button>
                            ) : (
                                <div className="w-6" />
                            )}

                            {category.children && category.children.length > 0 ? (
                                expandedCategories.has(category.id) ? (
                                    <FolderOpen className="h-5 w-5 text-blue-500" />
                                ) : (
                                    <Folder className="h-5 w-5 text-blue-500" />
                                )
                            ) : (
                                <Folder className="h-5 w-5 text-gray-400" />
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center">
                                <span className={`font-medium ${!category.is_active ? 'text-gray-400' : ''}`}>
                                    {category.name}
                                </span>
                                {!category.is_active && (
                                    <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                        Inactive
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">
                                {category.courses_count} courses • {category.description}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleToggleActive(category.id)}
                                className={`p-1 rounded ${category.is_active ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                                {category.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                                onClick={() => startEdit(category)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {category.children && category.children.length > 0 && expandedCategories.has(category.id) && (
                        <div>
                            {category.children
                                .sort((a, b) => a.order - b.order)
                                .map(child => (
                                    <div key={child.id}>
                                        <div
                                            className={`flex items-center py-3 px-4 border-b border-gray-200 hover:bg-gray-50 ${
                                                selectedCategories.includes(child.id) ? 'bg-blue-50' : ''
                                            }`}
                                            style={{ paddingLeft: `${40 + level * 24}px` }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(child.id)}
                                                onChange={(e) => handleSelectCategory(child.id, e.target.checked)}
                                                className="mr-3"
                                            />

                                            <Folder className="h-5 w-5 text-gray-400 mr-3" />

                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    <span className={`font-medium ${!child.is_active ? 'text-gray-400' : ''}`}>
                                                        {child.name}
                                                    </span>
                                                    {!child.is_active && (
                                                        <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {child.courses_count} courses • {child.description}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleToggleActive(child.id)}
                                                    className={`p-1 rounded ${child.is_active ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}
                                                >
                                                    {child.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    onClick={() => startEdit(child)}
                                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(child.id)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
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
            ));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Categories Management
                </h2>
            }
        >
            <Head title="Categories Management" />

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
                                            placeholder="Search categories..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <button
                                        onClick={() => setShowCreateForm(true)}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Category
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleSelectAll}
                                        className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        {selectedCategories.length === filteredCategories.length ? (
                                            <CheckSquare className="h-4 w-4 mr-2" />
                                        ) : (
                                            <Square className="h-4 w-4 mr-2" />
                                        )}
                                        Select All
                                    </button>

                                    {selectedCategories.length > 0 && (
                                        <button
                                            onClick={handleBulkDelete}
                                            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete ({selectedCategories.length})
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Create/Edit Form */}
                            {(showCreateForm || editingCategory) && (
                                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <h3 className="text-lg font-medium mb-4">
                                        {editingCategory ? 'Edit Category' : 'Create New Category'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Category name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Slug
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="category-slug"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                rows={3}
                                                placeholder="Category description"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Parent Category
                                            </label>
                                            <select
                                                value={formData.parent_id || ''}
                                                onChange={(e) => setFormData({...formData, parent_id: e.target.value || null})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">No Parent (Top Level)</option>
                                                {allCategories
                                                    .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                                                    .map(cat => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                                className="mr-2"
                                            />
                                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                                Active
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            {editingCategory ? 'Update Category' : 'Create Category'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowCreateForm(false);
                                                setEditingCategory(null);
                                                resetForm();
                                            }}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Categories Tree */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                {filteredCategories.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No categories found
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            {allCategories.length === 0 ? 'Create your first category to get started' : 'Try adjusting your search'}
                                        </p>
                                        {allCategories.length === 0 && (
                                            <button
                                                onClick={() => setShowCreateForm(true)}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create First Category
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    renderCategoryTree(filteredCategories)
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}