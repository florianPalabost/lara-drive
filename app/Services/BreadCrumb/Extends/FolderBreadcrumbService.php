<?php

declare(strict_types=1);

namespace App\Services\BreadCrumb\Extends;

use App\Models\Folder;
use App\Services\BreadCrumb\BreadcrumbService;
use Illuminate\Database\Eloquent\Model;

class FolderBreadcrumbService extends BreadcrumbService
{
    /**
     * @param Folder $folder
     * @return Breadcrumb[]
     */
    public static function folderIndexPage(Model $folder): array
    {
        $breadcrumbs = static::getHomeFoldersBreadcrumbs();

        self::digFolderBreadcrumb($folder, $breadcrumbs);

        return $breadcrumbs;
    }

    public static function editPermissionFolderPage(Folder $folder): array
    {
        return [
            ...static::folderIndexPage($folder),
            [
                'title' => 'Edit Permissions',
                'href'  => route('folders.share.edit', ['folder' => $folder->uuid]),
            ],
        ];
    }

    /**
     * @return Breadcrumb[]
     */
    public static function getHomeFoldersBreadcrumbs(): array
    {
        return [
            self::getHomeBreadcrumb(),
            [
                'title' => 'Folders',
                'href'  => route('folders.index'),
            ],
        ];
    }

    /**
     * @param Breadcrumb[] $breadcrumbs
     */
    private static function digFolderBreadcrumb(Folder $folder, array &$breadcrumbs): void
    {
        if ($folder->parent_id) {
            self::digFolderBreadcrumb($folder->parent, $breadcrumbs);
        }

        $breadcrumbs[] = [
            'title' => $folder->name,
            'href'  => route('folders.index', ['folder' => $folder->uuid]),
        ];
    }
}
