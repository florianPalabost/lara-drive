<?php

declare(strict_types=1);

use App\Http\Controllers\DriveFile\BulkArchiveDriveFileController;
use App\Http\Controllers\DriveFile\BulkDestroyDriveFileController;
use App\Http\Controllers\DriveFile\BulkRestoreDriveFileController;
use App\Http\Controllers\DriveFile\DownloadDriveFileController;
use App\Http\Controllers\DriveFile\DriveFileController;
use App\Http\Controllers\DriveFile\MoveDriveFileController;
use App\Http\Controllers\DriveFile\PreviewDriveFileController;
use App\Http\Controllers\DriveFile\RestoreDriveFileController;
use App\Http\Controllers\DriveFile\SearchDriveFileController;
use App\Http\Controllers\DriveFileShare\SharedDriveFileController;
use App\Http\Controllers\DriveFileShare\ShareDriveFileController;
use App\Http\Controllers\DriveFileVersion\DownloadDriveFileVersionController;
use App\Http\Controllers\DriveFileVersion\DriveFileVersionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('files/{uuid}/download', DownloadDriveFileController::class)->name('files.download');
    Route::get('/files/{file:uuid}/preview', PreviewDriveFileController::class)->name('files.preview');
    Route::post('/files/{file:uuid}/restore', RestoreDriveFileController::class)->name('files.restore')->withTrashed();
    Route::post('files/{file}/share', ShareDriveFileController::class)->name('files.share');
    Route::post('/files/move', MoveDriveFileController::class)->name('files.move');

    // TODO: see if shallow ?
    Route::get('/files/{file:uuid}/versions/{version:uuid}/download', DownloadDriveFileVersionController::class)->name('files.versions.download');
    Route::resource('files.versions', DriveFileVersionController::class);

    Route::get('files/recent', [DriveFileController::class, 'recent'])->name('files.recent');
    Route::post('files/restore', BulkRestoreDriveFileController::class)->name('files.restore.bulk');
    Route::post('/files/archive', BulkArchiveDriveFileController::class)->name('files.archive.bulk');
    Route::post('/files/destroy', BulkDestroyDriveFileController::class)->name('files.destroy.bulk');
    Route::get('files/search', SearchDriveFileController::class)->name('files.search');
    Route::get('files/trashed', [DriveFileController::class, 'trashed'])->name('files.trashed');
    Route::resource('files', DriveFileController::class);

});

Route::get('files/share/{token}', SharedDriveFileController::class)->name('files.shared')->middleware('signed');
