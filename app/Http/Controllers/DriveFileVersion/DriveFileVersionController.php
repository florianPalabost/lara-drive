<?php

declare(strict_types=1);

namespace App\Http\Controllers\DriveFileVersion;

use App\Actions\DriveFileVersion\CreateNewDriveFileVersion;
use App\Http\Controllers\Controller;
use App\Http\Requests\DriveFileVersion\StoreDriveFileVersionRequest;
use App\Models\DriveFile;
use Illuminate\Http\RedirectResponse;
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
}
