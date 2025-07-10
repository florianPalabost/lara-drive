<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Support\Str;

/**
 * Trait HasUuidColumn
 *
 * Automatically generates a UUID for the `uuid` column when a model is created.
 *
 * @mixin \Illuminate\Database\Eloquent\Model
 */
trait HasUuidColumn
{
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $model) {
            if (! $model->uuid) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
