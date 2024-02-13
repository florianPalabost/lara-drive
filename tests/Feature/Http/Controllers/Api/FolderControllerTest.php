<?php

declare(strict_types=1);

use App\Models\Folder;
use Symfony\Component\HttpFoundation\Response;

describe('API / FolderController', function () {

    it('should be able to retrieve folders', function () {
        $response = $this->getJson(route('api.folders.index'));

        expectSuccessfulApiResponse($response);
    });

    it('should be able to create a folder', function () {
        $response = $this->postJson(route('api.folders.store'), [
            'name' => 'Test Folder',
        ]);

        expectSuccessfulApiResponse($response, Response::HTTP_CREATED);
    });

    it('should be able to retrieve a folder', function () {
        $folder = Folder::factory()->create();

        $response = $this->getJson(route('api.folders.show', $folder));

        expectSuccessfulApiResponse($response);
    });

    it('should be able to update a folder', function () {
        $folder = Folder::factory()->create();

        $response = $this->putJson(route('api.folders.update', $folder), [
            'name' => 'Updated Folder',
        ]);

        expectSuccessfulApiResponse($response);
    });

    it('should be able to delete a folder', function () {
        $folder = Folder::factory()->create();

        $response = $this->deleteJson(route('api.folders.destroy', $folder));

        expect($response->getStatusCode())->toBe(Response::HTTP_NO_CONTENT);
    });
});
