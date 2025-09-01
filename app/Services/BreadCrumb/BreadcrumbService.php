<?php

declare(strict_types=1);

namespace App\Services;

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
