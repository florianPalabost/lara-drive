<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Folder;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class FolderService
{
    /**
     * Returns root-level folders for the given user.
     * Only one level of children is eagerly loaded —
     * deeper levels are fetched lazily via the load endpoint.
     *
     * @return Collection<int, Folder>
     */
    public function getRootFolders(User $user): Collection
    {
        return Folder::query()
            ->whereNull('parent_id')
            ->where('user_id', $user->id)
            ->with('children')
            ->orderBy('name')
            ->get();
    }
}
