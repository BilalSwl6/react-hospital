<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\Generic;
use App\Models\ExpenseRecord;

class Medicine extends Model
{
    use HasFactory;

    protected $table = 'medicines';

    protected $fillable = [
        'name',
        'description',
        'generic_id',
        'quantity',
        'price',
        'batch_no',
        'dosage',
        'strength',
        'route',
        'notes',
        'expiry_date',
        'category',
        'manufacturer',
        'status',
        'image',
    ];

    protected $casts = [
        'expiry_date' => 'date',
    ];

    public function generic()
    {
        return $this->belongsTo(Generic::class);
    }

    public function getTotalUsedAttribute()
    {
        $total = 0;
        $records = ExpenseRecord::where('medicine_id', $this->id)->get();
        foreach ($records as $record) {
            $total += $record->quantity;
        }
        return $total;
    }

    public function getResultAttribute()
    {
        $records = ExpenseRecord::where('medicine_id', $this->id)->where('expense_id', 1)->get();
        if ($records->count() > 0) {
            $total = 0;
            foreach ($records as $record) {
                $total += $record->quantity;
            }
            return $total;
        }
        return 0;
    }
}
