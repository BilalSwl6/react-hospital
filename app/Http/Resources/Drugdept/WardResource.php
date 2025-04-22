<?php

namespace App\Http\Resources\Drugdept;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WardResource extends JsonResource
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
            'name' => $this->ward_name,
            'description' => $this->ward_description,
            'capacity' => $this->ward_capacity,
            'status' => $this->ward_status,
        ];
    }
}
