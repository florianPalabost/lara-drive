<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\CustomFile
 */
class CustomFileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'size'       => $this->whenHas('size'),
            'path'       => $this->whenHas('path'),
            'extension'  => $this->whenHas('extension'),
            'created_by' => UserResource::make($this->whenLoaded('created_by')),
            'folder'     => FolderResource::make($this->whenLoaded('folder')),
        ];
    }
}
