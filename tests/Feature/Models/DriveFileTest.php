<?php

declare(strict_types=1);

use App\Models\DriveFile;
use App\Models\Folder;
use App\Models\User;

pest()->group('models');

describe('Models > DriveFile', function () {
    describe('Relations', function () {
        it('should belongs to a folder', function () {
            // Arrange
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
            // Arrange
            $user = User::factory()->create();

            // Act
            $file = DriveFile::factory()->create([
                'user_id' => $user->id,
            ]);

            // Assert
            expect($file->user->id)->toBe($user->id);
        });

        it('should has many drive file shares ???', function () {})->todo();
        it('should has many drive file versions', function () {})->todo();
    })->group('relations');

    it('should have only one active version per drive file', function () {})->todo();
});
