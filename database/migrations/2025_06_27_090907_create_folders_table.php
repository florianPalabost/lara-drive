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
        Schema::create('folders', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();

            $table->string('name');
            $table->string('path')->index(); // e.g. /1/2/3
            $table->foreignId('parent_id')->nullable()->constrained('folders')->cascadeOnDelete();

            $table->foreignId('user_id')->constrained();

            // TODO: state: public, private

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('folders');
    }
};
