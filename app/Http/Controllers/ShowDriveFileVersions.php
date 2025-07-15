<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\DriveFile;
use Illuminate\Http\Request;
use Inertia\Response;

class ShowDriveFileVersions extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, DriveFile $file): Response
    {
        $file->load(['versions']);

        return inertia('files/history', [
            'file'     => $file,
            'versions' => $file->versions,
        ]);
    }
}
