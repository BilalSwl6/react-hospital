<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Ward;
use App\Models\ExpenseRecord;

class Expense extends Model
{
    use HasFactory;

    protected $table = 'expenses';

    protected $fillable = ['date', 'ward_id', 'note', 'user_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ward(): BelongsTo
    {
        return $this->belongsTo(Ward::class);
    }

    public function expenseRecords()
    {
        return $this->hasMany(ExpenseRecord::class);
    }

    public function getTotalRecordsAttribute()
    {
        return $this->expenseRecords->count();
    }
}

