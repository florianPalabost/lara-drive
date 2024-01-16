<?php

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
            'size'       => $this->size,
            'path'       => $this->path,
            'extension'  => $this->extension,
            'created_by' => UserResource::make($this->whenLoaded('created_by')),
            'folder'     => FolderResource::make($this->whenLoaded('folder')),
        ];
    }
}
