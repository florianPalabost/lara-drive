<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\DriveFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class DownloadDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, string $uuid): Response
    {
        $file = DriveFile::query()->with('currentVersion')->where('uuid', $uuid)->firstOrFail();

        abort_unless(Storage::disk('minio')->exists($file->currentVersion->path), Response::HTTP_NOT_FOUND, 'File not found in storage.');

        return Storage::disk('minio')->download($file->currentVersion->path, $file->original_name, [
            'Content-Type'        => $file->currentVersion->mime_type,
            'Content-Disposition' => sprintf('attachment; filename="%s"', $file->original_name),
        ]);
    }
}
