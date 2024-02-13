<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\CustomFile;

class CustomFileObserver
{
    /**
     * Handle the CustomFile "created" event.
     */
    public function created(CustomFile $customFile): void
    {

    }

    /**
     * Handle the CustomFile "updated" event.
     */
    public function updated(CustomFile $customFile): void
    {

    }

    /**
     * Handle the CustomFile "deleted" event.
     */
    public function deleted(CustomFile $customFile): void
    {

    }

    /**
     * Handle the CustomFile "restored" event.
     */
    public function restored(CustomFile $customFile): void
    {

    }

    /**
     * Handle the CustomFile "force deleted" event.
     */
    public function forceDeleted(CustomFile $customFile): void
    {

    }
}
