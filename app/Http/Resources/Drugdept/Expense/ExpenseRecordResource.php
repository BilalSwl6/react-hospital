<?php

namespace App\Http\Resources\Drugdept\Expense;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseRecordResource extends JsonResource
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
            'expense_id' => $this->expense_id,
            'medicine_id' => $this->medicine_id,
            'quantity' => $this->quantity,
            'medicine' => [
                'id' => $this->medicine->id,
                'name' => $this->medicine->name,
                'generic_name' => $this->medicine->generic->generic_name,
                'route' => $this->medicine->route,
                'strength' => $this->medicine->strength,
                'category' => $this->medicine->category,
            ],
        ];
    }
}
