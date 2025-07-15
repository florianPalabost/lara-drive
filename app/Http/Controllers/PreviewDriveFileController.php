<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\DriveFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PreviewDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, DriveFile $file): StreamedResponse
    {
        $file->load('currentVersion');

        abort_unless(Storage::disk('minio')->exists($file->currentVersion->path), Response::HTTP_NOT_FOUND, 'File not found in storage.');
        $disk = Storage::disk('minio');
        $stream = $disk->readStream($file->currentVersion->path);

        return response()->stream(
            callback: function () use ($stream) {
                fpassthru($stream);
            }, headers: [
                'Content-Type'        => $file->currentVersion->mime_type,
                'Content-Disposition' => sprintf('inline; filename="%s"', $file->original_name),
            ]
        );
    }
}
