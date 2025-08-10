<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('drive_file_shares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('drive_file_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shared_with_user_id')->nullable()->constrained('users')->cascadeOnDelete();

            $table->uuid('public_token')->nullable()->unique();
            $table->string('permission', 20)->nullable();
            $table->dateTime('expires_at');

            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('drive_file_shares');
    }
};
