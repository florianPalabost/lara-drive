<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateNewDriveFile;
use App\Http\Requests\StoreDriveFileRequest;
use App\Http\Requests\UpdateDriveFileRequest;
use App\Models\DriveFile;
use App\Models\Folder;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
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
    public function store(StoreDriveFileRequest $request, CreateNewDriveFile $createNewDriveFileAction): RedirectResponse
    {
        $input = $request->validated();
        $uploadedFile = request()->file('file');

        $createNewDriveFileAction->handle([
            'folder_id' => $input['folder_id'],
            'file'      => $uploadedFile,
        ]);

        // TODO: if folder.show implemented return to show
        return to_route('folders.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(DriveFile $file) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DriveFile $file) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDriveFileRequest $request, DriveFile $file) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DriveFile $file): RedirectResponse
    {
        // TODO: delete file from storage
        try {
            Storage::disk('minio')->delete($file->path);
            $file->delete();
        }
        catch (Exception $exception) {
            report($exception);
        }

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
