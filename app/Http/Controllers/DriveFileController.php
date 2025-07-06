<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreDriveFileRequest;
use App\Http\Requests\UpdateDriveFileRequest;
use App\Models\DriveFile;
use App\Models\Folder;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class DriveFileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDriveFileRequest $request): RedirectResponse
    {
        $input = $request->validated();
        $uploadedFile = request()->file('file');

        $folder = Folder::query()
            ->where('uuid', $input['folder_id'])
            ->firstOrFail();
        $storedPath = $uploadedFile->storeAs("folders/{$folder->uuid}", $uploadedFile->getClientOriginalName(), 'minio');

        DriveFile::create([
            'folder_id'     => $input['folder_id'],
            'original_name' => $uploadedFile->getClientOriginalName(),
            'mime_type'     => $uploadedFile->getClientMimeType(),
            'size'          => $uploadedFile->getSize(),
            'path'          => $storedPath,
        ]);

        // TODO: if show implemented return to show
        return to_route('folders.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(DriveFile $driveFile) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DriveFile $driveFile) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDriveFileRequest $request, DriveFile $driveFile) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DriveFile $driveFile): RedirectResponse
    {
        $driveFile->delete();

        return to_route('folders.index');
    }

    public function recent(): Response
    {
        $recentFiles = auth()->user()
            ->files()
            ->latest()
            ->take(10)
            ->get();

        return inertia('files/recent', [
            'recentFiles' => $recentFiles,
        ]);
    }
}
