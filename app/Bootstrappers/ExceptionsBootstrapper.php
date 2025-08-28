<?php

declare(strict_types=1);

namespace App\Bootstrappers;

use Illuminate\Foundation\Configuration\Exceptions;

class ExceptionsBootstrapper
{
    /**
     * Invoke the class instance.
     */
    public function __invoke(Exceptions $exceptions): void {}
}
