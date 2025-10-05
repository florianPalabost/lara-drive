<?php

declare(strict_types=1);

namespace App\Enums;

enum ResourcePermissionEnum: string
{
    case VIEW = 'view';
    case COMMENT = 'comment';
    case EDIT = 'edit';
}
