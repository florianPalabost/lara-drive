<?php

declare(strict_types=1);

use App\Models\DriveFile;
use App\Models\Folder;
use App\Models\User;

pest()->group('models');

describe('Models > DriveFile', function () {
    it('should belongs to a folder', function () {
        // Arranage
        $folder = Folder::factory()->create();

        // Act
        $file = DriveFile::factory()->create([
            'folder_id' => $folder->id,
            'user_id'   => $folder->user_id,
        ]);

        // Assert
        expect($file->folder->id)->toBe($folder->id);
    });

    it('should belongs to a user', function () {
        // Arranage
        $user = User::factory()->create();

        // Act
        $file = DriveFile::factory()->create([
            'user_id' => $user->id,
        ]);

        // Assert
        expect($file->user->id)->toBe($user->id);
    });
});
