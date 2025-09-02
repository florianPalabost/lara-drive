<?php

declare(strict_types=1);

namespace App\Services\BreadCrumb;

abstract class BreadcrumbService
{
    /**
     * @return Breadcrumb
     */
    public static function getHomeBreadcrumb(): array
    {
        return [
            'title' => 'Home',
            'href'  => '/',
        ];
    }
}
