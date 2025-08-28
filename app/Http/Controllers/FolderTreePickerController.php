<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FolderTreePickerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $folders = Folder::query()
            ->select('uuid', 'name', 'parent_id', 'id')
            ->whereNull('parent_id')
            ->with('children')
            ->where('user_id', auth()->user()->id)
            ->orderBy('name')
            ->get();

        return response()->json([
            'folders' => $folders,
        ]);
    }
}
