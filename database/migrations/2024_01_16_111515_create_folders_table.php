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
            $table->uuid('id')->primary();
            // $table->uuid('left')->nullable();
            // $table->uuid('right')->nullable();
            // $table->integer('depth')->nullable();
            // $table->foreignUuid('parent_id')->nullable()->constrained('folders');
            $table->nestedSet();
            $table->string('name');
            $table->string('path');
            $table->foreignUuid('created_by')->nullable()->constrained('users', 'uuid');

            $table->timestamps();
            $table->softDeletes();
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
