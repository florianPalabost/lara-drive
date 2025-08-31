<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Folder;

class BreadcrumbService
{
    /**
     * @return array<array{title: string, href: string}>
     */
    public static function buildBreadcrumbFromFolder(Folder $folder): array
    {
        $breadcrumbs = self::getHomeFoldersBreadcrumbs();

        self::digFolderBreadcrumb($folder, $breadcrumbs);

        return $breadcrumbs;
    }

    /**
     * @return array<array{title: string, href: string}>
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
     * @return array{title: string, href: string}
     */
    public static function getHomeBreadcrumb(): array
    {
        return [
            'title' => 'Home',
            'href'  => '/',
        ];
    }

    /**
     * @param array<array{title: string, href: string}> $breadcrumbs
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
