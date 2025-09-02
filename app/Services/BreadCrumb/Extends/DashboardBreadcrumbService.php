<?php

declare(strict_types=1);

namespace App\Services\BreadCrumb\Extends;

use App\Services\BreadCrumb\BreadcrumbService;

class DashboardBreadcrumbService extends BreadcrumbService
{
    /**
     * @return Breadcrumb[]
     */
    public static function dashboardPage(): array
    {
        return [
            self::getHomeBreadcrumb(),
            [
                'title' => 'Dashboard',
                'href'  => route('dashboard'),
            ],
        ];
    }
}
