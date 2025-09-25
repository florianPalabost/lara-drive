<?php

declare(strict_types=1);

use App\Http\Controllers\Folder\FolderController;
use App\Http\Controllers\Folder\FolderTreePickerController;
use App\Http\Controllers\Folder\ImportFolderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/folders/{folder:uuid}/load', [FolderController::class, 'load'])->name('folders.load');
    Route::get('/folders/import', [ImportFolderController::class, 'import'])->name('folders.import');
    Route::post('/folders/import', [ImportFolderController::class, 'store'])->name('folders.import.store');
    Route::get('/folders/tree', FolderTreePickerController::class)->name('folders.tree');

    Route::resource('folders', FolderController::class);
});
