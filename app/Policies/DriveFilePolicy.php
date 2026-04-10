<?php

declare(strict_types=1);

namespace App\Policies;

use App\Enums\ResourcePermissionEnum;
use App\Models\DriveFile;
use App\Models\User;
use App\Services\ResourcePermissionService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class DriveFilePolicy
{
    public function __construct(protected ResourcePermissionService $resourcePermissionService) {}

    // /**
    //  * Determine whether the user can view any models.
    //  */
    // public function viewAny(User $user): bool
    // {
    //     return false;
    // }

    public function boot(): void
    {
        // Gate::define('custom-view-file', function (User $user, DriveFile $file) {
        //     return $user->id === $file->user_id;
        // });

        // // OR with policy mapping "acl/permission/ability" to policy method
        // // @see https://laravel.com/docs/12.x/authorization#writing-gates
        // Gate::define('custom-view-file', [DriveFilePolicy::class, 'view']);
    }

    // Extract common checks/codes for policies (is_admin check for example)
    public function before(User $user): bool
    {
        Log::debug('DriveFilePolicy before check', ['user_id' => $user->id]);

        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, DriveFile $driveFile): bool
    {
        return $this->resourcePermissionService->can($user, $driveFile, ResourcePermissionEnum::VIEW);
    }

    public function comment(User $user, DriveFile $driveFile): bool
    {
        return $this->resourcePermissionService->can($user, $driveFile, ResourcePermissionEnum::COMMENT);
    }

    public function edit(User $user, DriveFile $driveFile): bool
    {
        return $this->resourcePermissionService->can($user, $driveFile, ResourcePermissionEnum::EDIT);
    }
}
