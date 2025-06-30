<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class BenchFolder extends Model
{
    use NodeTrait;

    protected $fillable = ['name'];
}
