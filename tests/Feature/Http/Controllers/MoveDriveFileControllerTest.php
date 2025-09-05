<?php

declare(strict_types=1);

use App\Models\DriveFile;
use App\Models\DriveFileVersion;
use App\Models\Folder;
use App\Models\User;
use Tests\TestCase;

use function Pest\Laravel\assertDatabaseHas;

describe('Controllers > MoveDriveFileController', function () {
    beforeEach(function () {
        Storage::fake('local');
    });

    it('should move a drive file to another folder', function () {
        // Arrange
        $user = User::factory()->create();
        [$sourceFolder, $destinationFolder] = Folder::factory(2)->create([
            'user_id' => $user->id,
        ]);

        $file = DriveFile::factory()->create([
            'folder_id' => $sourceFolder->id,
            'user_id'   => $user->id,
        ]);

        // $versions = DriveFileVersion::factory(2)->for($file, 'file')->create([
        //     'path' => "users/{$user->uuid}/folders/{$sourceFolder->path}/{$sourceFolder->uuid}/{$file->uuid}",
        // ]);

        $versions = $file->versions()->saveMany(DriveFileVersion::factory(2)->sequence(['version' => 1, 'is_current' => false], ['version' => 2, 'is_current' => true])->for($file, 'file')->make([
            'path' => "users/{$user->uuid}/folders/{$sourceFolder->path}/{$sourceFolder->uuid}/{$file->uuid}",
        ]));

        $payload = [
            'file_ids'         => [$file->uuid],
            'target_folder_id' => $destinationFolder->uuid,
        ];

        // Act
        /** @var TestCase $this */
        $this->actingAs($user)->post('/files/move', $payload)->assertRedirectToRoute('files.index');

        // Assert

        // DB asserts
        assertDatabaseHas('drive_files', [
            'id'        => $file->id,
            'folder_id' => $destinationFolder->id,
        ]);
        assertDatabaseHas('drive_file_versions', [
            'drive_file_id' => $file->id,
            'path'          => "users/{$user->uuid}/folders/{$destinationFolder->path}/{$destinationFolder->uuid}/{$file->uuid}",
        ]);

        // Check files moved in storage
        foreach ($versions as $version) {
            Storage::assertExists("users/{$user->uuid}/folders/{$destinationFolder->path}/{$destinationFolder->uuid}/{$file->uuid}/{$version->uuid}");
            Storage::assertMissing("users/{$user->uuid}/folders/{$sourceFolder->path}/{$sourceFolder->uuid}/{$file->uuid}/{$version->uuid}");
        }
    });

    it('should move multiple files to another folder', function () {})->todo();

    it('should fails to move a file to the same folder', function () {})->todo();

    it('should fails move a file to a non existing folder', function () {})->todo();
});
