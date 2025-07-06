<?php

declare(strict_types=1);

use App\Http\Controllers\DownloadDriveFileController;
use App\Http\Controllers\DriveFileController;
use App\Http\Controllers\FolderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('files/{uuid}/download', DownloadDriveFileController::class)->name('files.download');
    Route::get('files/recent', [DriveFileController::class, 'recent'])->name('files.recent');
    Route::resource('files', DriveFileController::class);
    Route::resource('folders', FolderController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
