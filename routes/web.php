<?php

declare(strict_types=1);

use App\Http\Controllers\DownloadDriveFileController;
use App\Http\Controllers\DownloadDriveFileVersionController;
use App\Http\Controllers\DriveFileController;
use App\Http\Controllers\DriveFileVersionController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\FolderTreePickerController;
use App\Http\Controllers\ImportFolderController;
use App\Http\Controllers\PreviewDriveFileController;
use App\Http\Controllers\SearchDriveFileController;
use App\Http\Controllers\SharedDriveFileController;
use App\Http\Controllers\ShareDriveFileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/folders/{folder:uuid}/load', [FolderController::class, 'load'])->name('folders.load');
    Route::get('/folders/import', [ImportFolderController::class, 'import'])->name('folders.import');
    Route::post('/folders/import', [ImportFolderController::class, 'store'])->name('folders.import.store');
    Route::get('/folders/tree', FolderTreePickerController::class)->name('folders.tree');
    Route::resource('folders', FolderController::class);

    Route::get('files/{uuid}/download', DownloadDriveFileController::class)->name('files.download');
    Route::get('/files/{file:uuid}/preview', PreviewDriveFileController::class)->name('files.preview');
    Route::post('files/{file}/share', ShareDriveFileController::class)->name('files.share');

    // TODO: see if shallow ?
    Route::get('/files/{file:uuid}/versions/{version:uuid}/download', DownloadDriveFileVersionController::class)->name('files.versions.download');
    Route::resource('files.versions', DriveFileVersionController::class);

    Route::get('files/recent', [DriveFileController::class, 'recent'])->name('files.recent');
    Route::get('files/search', SearchDriveFileController::class)->name('files.search');
    Route::resource('files', DriveFileController::class);

});

Route::get('files/share/{token}', SharedDriveFileController::class)->name('files.shared')->middleware('signed');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
