<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index()
    {
        $media = Media::with('uploader')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return inertia('Admin/Media/Index', compact('media'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'required|file|max:51200', // 50MB max
            'collection' => 'nullable|string',
            'folder' => 'nullable|string',
        ]);

        $uploadedFiles = [];
        $collection = $request->collection ?? 'default';
        $folder = $request->folder ?? '/';

        foreach ($request->file('files') as $file) {
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $mimeType = $file->getMimeType();
            $fileSize = $file->getSize();
            $fileHash = hash_file('md5', $file->getPathname());

            // Generate unique filename
            $filename = Str::uuid() . '.' . $extension;

            // Store file
            $path = $file->storeAs('media/' . $collection . $folder, $filename, 'public');

            // Create media record
            $media = Media::create([
                'name' => pathinfo($originalName, PATHINFO_FILENAME),
                'file_name' => $filename,
                'mime_type' => $mimeType,
                'path' => $path,
                'disk' => 'public',
                'file_hash' => $fileHash,
                'file_size' => $fileSize,
                'collection' => $collection,
                'folder' => $folder,
                'uploaded_by' => auth()->id(),
                'is_public' => true,
            ]);

            $uploadedFiles[] = $media;
        }

        return response()->json([
            'message' => 'Files uploaded successfully',
            'files' => $uploadedFiles
        ]);
    }

    public function show(Media $media)
    {
        return response()->json($media->load('uploader'));
    }

    public function update(Request $request, Media $media)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'folder' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $media->update($request->only([
            'name', 'alt_text', 'description', 'folder', 'is_public'
        ]));

        return response()->json([
            'message' => 'Media updated successfully',
            'media' => $media
        ]);
    }

    public function destroy(Media $media)
    {
        // Delete file from storage
        Storage::disk($media->disk)->delete($media->path);

        // Delete record
        $media->delete();

        return response()->json([
            'message' => 'Media deleted successfully'
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:media,id',
        ]);

        $media = Media::whereIn('id', $request->ids)->get();

        foreach ($media as $item) {
            Storage::disk($item->disk)->delete($item->path);
            $item->delete();
        }

        return response()->json([
            'message' => 'Selected media files deleted successfully'
        ]);
    }

    public function folders()
    {
        $folders = Media::select('folder')
            ->distinct()
            ->where('folder', '!=', '/')
            ->pluck('folder');

        return response()->json($folders);
    }

    public function collections()
    {
        $collections = Media::select('collection')
            ->distinct()
            ->pluck('collection');

        return response()->json($collections);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');

        $media = Media::with('uploader')
            ->where('name', 'like', "%{$query}%")
            ->orWhere('file_name', 'like', "%{$query}%")
            ->orWhere('alt_text', 'like', "%{$query}%")
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($media);
    }

    public function download(Media $media)
    {
        return Storage::disk($media->disk)->download($media->path, $media->name);
    }
}
