<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\SearchDriveFileRequest;
use App\Models\DriveFile;
use Illuminate\Support\Str;
use Inertia\Response;

class SearchDriveFileController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(SearchDriveFileRequest $request): Response
    {
        $query = Str::lower((string) $request->validated('q'));

        $files = DriveFile::query()
            ->where('user_id', auth()->user()->id)
            ->where('original_name', 'like', "%{$query}%")
            ->get();

        return inertia('files/search', [
            'files' => $files,
            'query' => $query,
        ]);
    }
}
