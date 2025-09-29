<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Folder;
use App\Models\User;
use App\Services\ResourcePermissionService;

class FolderPolicy
{
    public function __construct(protected ResourcePermissionService $resourcePermissionService) {}

    public function view(User $user, Folder $folder): bool
    {
        return $this->resourcePermissionService->can($user, $folder, 'view');
    }

    public function comment(User $user, Folder $folder): bool
    {
        return $this->resourcePermissionService->can($user, $folder, 'comment');
    }

    public function edit(User $user, Folder $folder): bool
    {
        return $this->resourcePermissionService->can($user, $folder, 'edit');
    }
    // /**
    //  * Determine whether the user can view any models.
    //  */
    // public function viewAny(User $user): bool
    // {
    //     return false;
    // }

    // /**
    //  * Determine whether the user can view the model.
    //  */
    // public function view(User $user, Folder $folder): bool
    // {
    //     return false;
    // }

    // /**
    //  * Determine whether the user can create models.
    //  */
    // public function create(User $user): bool
    // {
    //     return false;
    // }

    // /**
    //  * Determine whether the user can update the model.
    //  */
    // public function update(User $user, Folder $folder): bool
    // {
    //     return false;
    // }

    // /**
    //  * Determine whether the user can delete the model.
    //  */
    // public function delete(User $user, Folder $folder): bool
    // {
    //     return false;
    // }

    // /**
    //  * Determine whether the user can restore the model.
    //  */
    // public function restore(User $user, Folder $folder): bool
    // {
    //     return false;
    // }

    // /**
    //  * Determine whether the user can permanently delete the model.
    //  */
    // public function forceDelete(User $user, Folder $folder): bool
    // {
    //     return false;
    // }
}
