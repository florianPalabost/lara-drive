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
        Schema::create('adjacency_folders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('parent_id')->nullable()->constrained('adjacency_folders')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('nested_set_folders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->nestedSet(); // adds _lft, _rgt, parent_id
            $table->timestamps();
        });

        Schema::create('materialized_path_folders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('path')->index(); // e.g. /1/2/3
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adjacency_folders');
        Schema::dropIfExists('nested_set_folders');
        Schema::dropIfExists('materialized_path_folders');
    }
};
