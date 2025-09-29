<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ResourcePermission;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ResourcePermissionService
{
    public function can(User $user, Model $resource, string $action): bool
    {
        // owner always has permission
        if (property_exists($resource, 'user_id') && $resource->user_id === $user->id) {
            return true;
        }

        $permission = ResourcePermission::query()
            ->where('permissionable_type', get_class($resource))
            ->where('permissionable_id', $resource->id)
            ->where('user_id', $user->id)
            ->value('permission');

        // TODO: create enum for permissions
        return match ($action) {
            'view'    => in_array($permission, ['view', 'comment', 'edit'], true),
            'comment' => in_array($permission, ['comment', 'edit'], true),
            'edit'    => $permission === 'edit',
            default   => false,
        };
    }

    public function grant(User $user, Model $resource, string $permission): ResourcePermission
    {
        return ResourcePermission::updateOrCreate(
            [
                'permissionable_type' => get_class($resource),
                'permissionable_id'   => $resource->id,
                'user_id'             => $user->id,
            ],
            [
                'permission' => $permission,
            ]
        );
    }

    public function revoke(User $user, Model $resource): void
    {
        ResourcePermission::query()
            ->where('permissionable_type', get_class($resource))
            ->where('permissionable_id', $resource->id)
            ->where('user_id', $user->id)
            ->delete();
    }

    public function revokeAll(User $user): void
    {
        ResourcePermission::query()
            ->where('user_id', $user->id)
            ->delete();
    }

    public function getUserPermission(User $user, Model $resource): ?string
    {
        return ResourcePermission::query()
            ->where('permissionable_type', get_class($resource))
            ->where('permissionable_id', $resource->id)
            ->where('user_id', $user->id)
            ->value('permission');
    }
}
