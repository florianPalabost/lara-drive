<?php

declare(strict_types=1);

namespace App\Services\BreadCrumb\Extends;

use App\Services\BreadCrumb\BreadcrumbService;

class TrashedFileBreadcrumbService extends BreadcrumbService
{
    /**
     * @return Breadcrumb[]
     */
    public static function trashedPage(): array
    {
        return [
            self::getHomeBreadcrumb(),
            [
                'title' => 'Trashed Files',
                'href'  => route('files.trashed'),
            ],
        ];
    }
}
