<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Folder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CreateNewFolder
{
    /**
     * @param array{name: string, parent_id: ?string} $data
     */
    public function handle(array $data): Folder
    {
        $parentFolder = Arr::has($data, 'parent_id') && $data['parent_id']
            ? Folder::query()
                ->where('uuid', $data['parent_id'])
                ->firstOrFail()
            : null;

        $folderUuid = Str::uuid7()->toString();
        $folderPath = $this->buildFolderPath($folderUuid, $parentFolder);

        $payload = [
            ...$data,
            'parent_id' => $parentFolder->id ?? null,
            'path'      => $folderPath,
            'user_id'   => auth()->user()->id,
            'uuid'      => $folderUuid,
        ];

        return Folder::create($payload);
    }

    private function buildFolderPath(string $folderUuid, ?Folder $parentFolder): string
    {
        $parentFolderPath = $parentFolder ? $parentFolder->path : '';

        $folderPath = sprintf('%s/%s', $parentFolderPath, $folderUuid);

        return str_replace('//', '/', $folderPath);
    }
}
