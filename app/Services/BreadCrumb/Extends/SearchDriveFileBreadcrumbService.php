<?php

declare(strict_types=1);

namespace App\Services\BreadCrumb\Extends;

use App\Services\BreadCrumb\BreadcrumbService;

class SearchDriveFileBreadcrumbService extends BreadcrumbService
{
    /**
     * @return Breadcrumb[]
     */
    public static function searchPage(string $query): array
    {
        return [
            self::getHomeBreadcrumb(),
            [
                'title' => 'Search: ' . $query,
                'href'  => route('files.search', ['q' => $query]),
            ],
        ];
    }
}
