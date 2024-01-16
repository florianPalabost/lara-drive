<?php

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
        Schema::create('custom_files', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('name');
            $table->string('path');
            $table->float('size');
            $table->string('extension');
            $table->foreignUuid('created_by')->constrained('users', 'uuid');
            $table->foreignUuid('folder_id')->constrained('folders');
            $table->boolean('is_public')->default(false);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_files');
    }
};
