<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void {}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // throw exception when :
        // - Lazy loading relationship
        // - Assigning non-fillable attributes
        // - Accessing attributes that don’t exist (or were not retrieved).
        Model::shouldBeStrict(
            ! app()->isProduction()
        );
    }
}
