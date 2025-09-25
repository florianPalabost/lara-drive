<?php

declare(strict_types=1);

namespace App\Http\Controllers\DriveFile;

use App\Http\Controllers\Controller;
use App\Models\DriveFileVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PreviewDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, DriveFileVersion $file): StreamedResponse
    {
        $file->load('file');
        $fileAssociated = $file->file;

        abort_unless(
            boolean: Storage::disk('minio')->exists($file->path),
            code: Response::HTTP_NOT_FOUND,
            message: 'File not found in storage.'
        );

        $disk = Storage::disk('minio');
        $stream = $disk->readStream($file->path);

        return response()->stream(
            callback: function () use ($stream) {
                fpassthru($stream);
            }, headers: [
                'Content-Type'        => $file->mime_type,
                'Content-Disposition' => sprintf('inline; filename="%s"', $fileAssociated->original_name),
            ]
        );
    }
}
