<?php

namespace App\Http\Resources\Drugdept\Medicine;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MedicineResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'generic_id' => $this->generic_id,
            'generic_name' => $this->generic->name,
            'quantity' => $this->quantity,
            'total_quantity' => $this->total_quantity,
            'price' => $this->price,
            'batch_no' => $this->batch_no,
            'dosage' => $this->dosage,
            'strength' => $this->strength,
            'route' => $this->route,
            'notes' => $this->notes,
            'expiry_date' => $this->expiry_date,
            'category' => $this->category,
            'manufacturer' => $this->manufacturer,
            'status' => $this->status,
            'image' => $this->image,
        ];
    }
}
