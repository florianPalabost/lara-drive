<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait HasTimestampsScopes
{
    /**
     * Scope a query to only include records created before a certain datetime.
     *
     * @param  Builder<Model>  $builder  The query builder instance
     * @param  mixed  $value  The datetime to compare against
     * @return Builder<Model> The query builder instance
     */
    public function scopeBeforeCreatedAt(Builder $builder, $value): Builder
    {
        return $builder->where('created_at', '<', $value);
    }

    /**
     * Scope a query to only include records created after a certain datetime.
     *
     * @param  Builder<Model>  $builder  The query builder instance
     * @param  mixed  $value  The datetime to compare against
     * @return Builder<Model> The query builder instance
     */
    public function scopeAfterCreatedAt(Builder $builder, $value): Builder
    {
        return $builder->where('created_at', '>', $value);
    }

    /**
     * Scope a query to only include records updated before a certain datetime.
     *
     * @param  Builder<Model>  $builder  The query builder instance
     * @param  mixed  $value  The datetime to compare against
     * @return Builder<Model> The query builder instance
     */
    public function scopeBeforeUpdatedAt(Builder $builder, $value): Builder
    {
        return $builder->where('updated_at', '<', $value);
    }

    /**
     * Scope a query to only include records updated after a certain datetime.
     *
     * @param  Builder<Model>  $builder  The query builder instance
     * @param  mixed  $value  The datetime to compare against
     * @return Builder<Model> The query builder instance
     */
    public function scopeAfterUpdatedAt(Builder $builder, $value): Builder
    {
        return $builder->where('updated_at', '>', $value);
    }
}
