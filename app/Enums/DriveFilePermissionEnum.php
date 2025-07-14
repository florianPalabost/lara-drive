<?php

declare(strict_types=1);

namespace App\Enums;

enum DriveFilePermissionEnum: string
{
    case READ = 'read';
    case WRITE = 'write';
}
