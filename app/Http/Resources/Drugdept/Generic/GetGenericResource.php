<?php

namespace App\Http\Resources\Drugdept\Generic;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GetGenericResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->generic_name,
        ];
    }
}
