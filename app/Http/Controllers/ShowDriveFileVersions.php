<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\DriveFile;
use Exception;
use Illuminate\Http\Request;
use Inertia\Response;

class ShowDriveFileVersions extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, DriveFile $file): Response
    {
        throw new Exception('Not used');
    }
}
