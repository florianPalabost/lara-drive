<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\DriveFile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RestoreDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, DriveFile $file): RedirectResponse
    {
        DB::transaction(function () use ($file) {
            $file->restore();

            $file->refresh();

            $file->currentVersion()->restore();
        });

        return to_route('files.trashed');
    }
}
