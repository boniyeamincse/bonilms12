import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { Plus, Edit, Trash2, Play, FileText, Upload, X } from 'lucide-react';

export default function Curriculum({ course }) {
    const [sections, setSections] = useState(course.sections || []);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [showLectureModal, setShowLectureModal] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [editingLecture, setEditingLecture] = useState(null);
    const [currentSectionId, setCurrentSectionId] = useState(null);

    const sectionForm = useForm({
        title: '',
    });

    const lectureForm = useForm({
        title: '',
        type: 'text',
        content: '',
        duration: '',
        attachments: [],
    });

    const addSection = () => {
        sectionForm.reset();
        setEditingSection(null);
        setShowSectionModal(true);
    };

    const editSection = (section) => {
        sectionForm.setData({
            title: section.title,
        });
        setEditingSection(section);
        setShowSectionModal(true);
    };

    const saveSection = (e) => {
        e.preventDefault();
        if (editingSection) {
            sectionForm.put(route('instructor.courses.sections.update', [course.id, editingSection.id]), {
                onSuccess: () => {
                    setShowSectionModal(false);
                    // Refresh sections
                    window.location.reload();
                },
            });
        } else {
            sectionForm.post(route('instructor.courses.sections.store', course.id), {
                onSuccess: () => {
                    setShowSectionModal(false);
                    // Refresh sections
                    window.location.reload();
                },
            });
        }
    };

    const deleteSection = (sectionId) => {
        if (confirm('Are you sure you want to delete this section?')) {
            fetch(route('instructor.courses.sections.delete', [course.id, sectionId]), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            }).then(() => {
                window.location.reload();
            });
        }
    };

    const addLecture = (sectionId) => {
        lectureForm.reset();
        setEditingLecture(null);
        setCurrentSectionId(sectionId);
        setShowLectureModal(true);
    };

    const editLecture = (lecture) => {
        lectureForm.setData({
            title: lecture.title,
            type: lecture.type,
            content: lecture.content,
            duration: lecture.duration,
        });
        setEditingLecture(lecture);
        setCurrentSectionId(lecture.section_id);
        setShowLectureModal(true);
    };

    const saveLecture = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(lectureForm.data).forEach(key => {
            if (key === 'attachments' && lectureForm.data.attachments.length > 0) {
                lectureForm.data.attachments.forEach((file, index) => {
                    formData.append(`attachments[${index}]`, file);
                });
            } else if (key !== 'attachments') {
                formData.append(key, lectureForm.data[key]);
            }
        });

        if (editingLecture) {
            fetch(route('instructor.courses.lectures.update', [course.id, currentSectionId, editingLecture.id]), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-HTTP-Method-Override': 'PUT',
                },
                body: formData,
            }).then(() => {
                setShowLectureModal(false);
                window.location.reload();
            });
        } else {
            fetch(route('instructor.courses.lectures.store', [course.id, currentSectionId]), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: formData,
            }).then(() => {
                setShowLectureModal(false);
                window.location.reload();
            });
        }
    };

    const deleteLecture = (lectureId) => {
        if (confirm('Are you sure you want to delete this lecture?')) {
            fetch(route('instructor.courses.lectures.delete', [course.id, currentSectionId, lectureId]), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            }).then(() => {
                window.location.reload();
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Course Curriculum - {course.title}
                </h2>
            }
        >
            <Head title="Course Curriculum" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Course Sections</h3>
                                <PrimaryButton onClick={addSection}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Section
                                </PrimaryButton>
                            </div>

                            <div className="space-y-4">
                                {sections.map((section, index) => (
                                    <div key={section.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium">{section.title}</h4>
                                            <div className="flex space-x-2">
                                                <SecondaryButton size="sm" onClick={() => addLecture(section.id)}>
                                                    <Plus className="w-4 h-4 mr-1" />
                                                    Add Lecture
                                                </SecondaryButton>
                                                <SecondaryButton size="sm" onClick={() => editSection(section)}>
                                                    <Edit className="w-4 h-4" />
                                                </SecondaryButton>
                                                <SecondaryButton size="sm" variant="danger" onClick={() => deleteSection(section.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </SecondaryButton>
                                            </div>
                                        </div>

                                        {/* Lectures */}
                                        <div className="space-y-2">
                                            {section.lectures?.map((lecture) => (
                                                <div key={lecture.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded">
                                                    <div className="flex items-center">
                                                        {lecture.type === 'video' && <Play className="w-4 h-4 mr-2" />}
                                                        {lecture.type === 'text' && <FileText className="w-4 h-4 mr-2" />}
                                                        {lecture.type === 'quiz' && <FileText className="w-4 h-4 mr-2" />}
                                                        {lecture.type === 'assignment' && <Upload className="w-4 h-4 mr-2" />}
                                                        <span>{lecture.title}</span>
                                                        {lecture.duration && (
                                                            <span className="text-sm text-gray-500 ml-2">({lecture.duration} min)</span>
                                                        )}
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <SecondaryButton size="sm" onClick={() => editLecture(lecture)}>
                                                            <Edit className="w-4 h-4" />
                                                        </SecondaryButton>
                                                        <SecondaryButton size="sm" variant="danger" onClick={() => deleteLecture(lecture.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </SecondaryButton>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Modal */}
            <Modal show={showSectionModal} onClose={() => setShowSectionModal(false)}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">
                            {editingSection ? 'Edit Section' : 'Add New Section'}
                        </h3>
                        <button
                            onClick={() => setShowSectionModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={saveSection}>
                        <div className="mb-4">
                            <InputLabel htmlFor="section_title" value="Section Title" />
                            <TextInput
                                id="section_title"
                                type="text"
                                className="mt-1 block w-full"
                                value={sectionForm.data.title}
                                onChange={(e) => sectionForm.setData('title', e.target.value)}
                                required
                            />
                            <InputError message={sectionForm.errors.title} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end">
                            <SecondaryButton type="button" onClick={() => setShowSectionModal(false)}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton className="ml-4" disabled={sectionForm.processing}>
                                {editingSection ? 'Update Section' : 'Add Section'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Lecture Modal */}
            <Modal show={showLectureModal} onClose={() => setShowLectureModal(false)}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">
                            {editingLecture ? 'Edit Lecture' : 'Add New Lecture'}
                        </h3>
                        <button
                            onClick={() => setShowLectureModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={saveLecture}>
                        <div className="mb-4">
                            <InputLabel htmlFor="lecture_title" value="Lecture Title" />
                            <TextInput
                                id="lecture_title"
                                type="text"
                                className="mt-1 block w-full"
                                value={lectureForm.data.title}
                                onChange={(e) => lectureForm.setData('title', e.target.value)}
                                required
                            />
                            <InputError message={lectureForm.errors.title} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="lecture_type" value="Lecture Type" />
                            <select
                                id="lecture_type"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                value={lectureForm.data.type}
                                onChange={(e) => lectureForm.setData('type', e.target.value)}
                            >
                                <option value="text">Text</option>
                                <option value="video">Video</option>
                                <option value="quiz">Quiz</option>
                                <option value="assignment">Assignment</option>
                            </select>
                            <InputError message={lectureForm.errors.type} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="lecture_content" value="Content" />
                            <textarea
                                id="lecture_content"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                rows={4}
                                value={lectureForm.data.content}
                                onChange={(e) => lectureForm.setData('content', e.target.value)}
                                placeholder={lectureForm.data.type === 'video' ? 'Enter video URL' : 'Enter content'}
                            />
                            <InputError message={lectureForm.errors.content} className="mt-2" />
                        </div>

                        {lectureForm.data.type === 'video' && (
                            <div className="mb-4">
                                <InputLabel htmlFor="lecture_duration" value="Duration (minutes)" />
                                <TextInput
                                    id="lecture_duration"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={lectureForm.data.duration}
                                    onChange={(e) => lectureForm.setData('duration', e.target.value)}
                                />
                                <InputError message={lectureForm.errors.duration} className="mt-2" />
                            </div>
                        )}

                        <div className="mb-4">
                            <InputLabel htmlFor="lecture_attachments" value="Attachments" />
                            <input
                                id="lecture_attachments"
                                type="file"
                                multiple
                                className="mt-1 block w-full"
                                onChange={(e) => lectureForm.setData('attachments', Array.from(e.target.files))}
                            />
                            <InputError message={lectureForm.errors.attachments} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end">
                            <SecondaryButton type="button" onClick={() => setShowLectureModal(false)}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton className="ml-4" disabled={lectureForm.processing}>
                                {editingLecture ? 'Update Lecture' : 'Add Lecture'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}