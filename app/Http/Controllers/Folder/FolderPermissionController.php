<?php

declare(strict_types=1);

namespace App\Http\Controllers\Folder;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\ResourcePermission;
use App\Services\BreadCrumb\Extends\FolderBreadcrumbService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class FolderPermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Folder $folder): JsonResponse
    {
        $permissions = ResourcePermission::query()
            ->with('user:id,name,email')
            ->where('permissionable_type', Folder::class)
            ->where('permissionable_id', $folder->id)
            ->get();

        $folder->load('shares');

        return response()->json([
            'permissions' => $permissions,
            'shares'      => $folder->shares()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {}

    public function edit(Request $request, Folder $folder): Response
    {
        Gate::authorize('edit', $folder);

        $folder->load('permissions', 'shares');

        return inertia('folders/share/edit', [
            'breadcrumbs' => FolderBreadcrumbService::editPermissionFolderPage($folder),
            'folder'      => $folder,
            'sharedUsers' => $folder->permissions()->with('user:id,name,email')->get(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder) {}
}
