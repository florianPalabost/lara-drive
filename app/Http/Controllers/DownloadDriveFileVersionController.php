<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\DriveFile;
use App\Models\DriveFileVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class DownloadDriveFileVersionController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, DriveFile $file, DriveFileVersion $version): Response
    {
        abort_unless(Storage::disk('minio')->exists($version->path), Response::HTTP_NOT_FOUND, 'File not found in storage.');

        return Storage::disk('minio')->download($version->path, $file->original_name, [
            'Content-Type'        => $version->mime_type,
            'Content-Disposition' => sprintf('attachment; filename="%s"', $file->original_name),
        ]);
    }
}
