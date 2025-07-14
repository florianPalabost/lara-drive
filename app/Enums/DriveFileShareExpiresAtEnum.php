<?php

declare(strict_types=1);

namespace App\Enums;

enum DriveFileShareExpiresAtEnum: string
{
    case ONE_DAY = '1d';
    case SEVEN_DAYS = '7d';
    case THIRTY_DAYS = '30d';
    case NEVER = 'never';
}
