<?php

declare(strict_types=1);

namespace App\Http\Controllers\DriveFileVersion;

use App\Actions\DriveFileVersion\CreateNewDriveFileVersion;
use App\Http\Controllers\Controller;
use App\Http\Requests\DriveFileVersion\StoreDriveFileVersionRequest;
use App\Models\DriveFile;
use App\Models\DriveFileVersion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Inertia\Response;

class DriveFileVersionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(DriveFile $file): Response
    {
        $file->load(['versions', 'versions.file', 'versions.file.currentVersion']);

        return inertia('files/history', [
            'file'     => $file,
            'versions' => $file->versions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(DriveFile $file) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreDriveFileVersionRequest $request,
        DriveFile $file,
        CreateNewDriveFileVersion $createNewDriveFileVersionAction
    ): RedirectResponse {
        /** @var array{file: UploadedFile} $input */
        $input = $request->validated();
        $payload = [
            'file' => $input['file'],
        ];

        $newDriveFileVersion = $createNewDriveFileVersionAction->handle($file, $payload);

        return to_route('files.versions.index', ['file' => $file->uuid]);
    }

    /**
     * Display the specified resource.
     */
    public function show(DriveFile $file, DriveFileVersion $version) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DriveFile $file, DriveFileVersion $version) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DriveFile $file, DriveFileVersion $version) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DriveFile $file, DriveFileVersion $version) {}
}
