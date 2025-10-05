<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\ResourcePermissionEnum;
use App\Models\ResourcePermission;
use App\Models\User;
use Illuminate\Database\Eloquent\MissingAttributeException;
use Illuminate\Database\Eloquent\Model;

class ResourcePermissionService
{
    public function can(User $user, Model $resource, ResourcePermissionEnum $action): bool
    {
        // owner always has permission
        if ($resource->hasAttribute('user_id') && $resource->getAttribute('user_id') === $user->id) {
            return true;
        }

        if ($resource->hasAttribute('id') === false) {
            throw new MissingAttributeException($resource, 'id');
        }

        $permission = ResourcePermission::query()
            ->where('permissionable_type', get_class($resource))
            ->where('permissionable_id', $resource->getAttribute('id'))
            ->where('user_id', $user->id)
            ->value('permission');

        return match ($action) {
            ResourcePermissionEnum::VIEW    => in_array($permission, ResourcePermissionEnum::cases(), true),
            ResourcePermissionEnum::COMMENT => in_array($permission, [ResourcePermissionEnum::COMMENT, ResourcePermissionEnum::EDIT], true),
            // ResourcePermissionEnum::EDIT    => true,
            default                         => false,
        };
    }

    public function grant(User $user, Model $resource, ResourcePermissionEnum $permission): ResourcePermission
    {
        if ($resource->hasAttribute('id') === false) {
            throw new MissingAttributeException($resource, 'id');
        }

        return ResourcePermission::updateOrCreate(
            [
                'permissionable_type' => get_class($resource),
                'permissionable_id'   => $resource->getAttribute('id'),
                'user_id'             => $user->id,
            ],
            [
                'permission' => $permission->value,
            ]
        );
    }

    public function revoke(User $user, Model $resource): void
    {
        if ($resource->hasAttribute('id') === false) {
            throw new MissingAttributeException($resource, 'id');
        }

        ResourcePermission::query()
            ->where('permissionable_type', get_class($resource))
            ->where('permissionable_id', $resource->getAttribute('id'))
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
        if ($resource->hasAttribute('id') === false) {
            throw new MissingAttributeException($resource, 'id');
        }

        return ResourcePermission::query()
            ->where('permissionable_type', get_class($resource))
            ->where('permissionable_id', $resource->getAttribute('id'))
            ->where('user_id', $user->id)
            ->value('permission');
    }
}
