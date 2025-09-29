<?php

declare(strict_types=1);

namespace App\Http\Controllers\DriveFile;

use App\Actions\DriveFile\BulkCreateNewDriveFiles;
use App\Actions\DriveFile\DeleteDriveFile;
use App\Http\Controllers\Controller;
use App\Http\Requests\DriveFile\StoreDriveFileRequest;
use App\Models\DriveFile;
use App\Services\BreadCrumb\Extends\DashboardBreadcrumbService;
use App\Services\BreadCrumb\Extends\TrashedFileBreadcrumbService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Inertia\Response;

class DriveFileController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDriveFileRequest $request, BulkCreateNewDriveFiles $bulkCreateNewDriveFilesAction): RedirectResponse
    {
        /** @var array{folder_id: string, files: UploadedFile[]} $input */
        $input = $request->validated();

        $bulkCreateNewDriveFilesAction->handle($input);

        return to_route('folders.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DriveFile $file, DeleteDriveFile $deleteDriveFileAction): RedirectResponse
    {
        $deleteDriveFileAction->handle($file);

        return to_route('folders.index', ['folder' => $file->folder->uuid]);
    }

    public function recent(DashboardBreadcrumbService $dashboardBreadcrumbService): Response
    {
        $recentFiles = auth()->user()
            ->files()
            ->latest()
            ->take(10)
            ->get();

        return inertia('files/recent', [
            'recentFiles' => $recentFiles,
            'breadcrumbs' => $dashboardBreadcrumbService->dashboardPage(),
        ]);
    }

    public function trashed(TrashedFileBreadcrumbService $trashedFileBreadcrumbService): Response
    {
        $trashedFiles = auth()->user()
            ->files()
            ->with('folder')
            ->onlyTrashed()
            ->get();

        return inertia('files/trashed', [
            'trashedFiles' => $trashedFiles,
            'breadcrumbs'  => $trashedFileBreadcrumbService->trashedPage(),
        ]);
    }
}
