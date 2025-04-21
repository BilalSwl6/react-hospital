<?php
namespace App\Models;

use App\Models\Expense;
use App\Models\Medicine;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExpenseRecord extends Model
{
    use HasFactory;

    // Ensure the table name matches the actual table in your database
    protected $table = 'expense_record';  // Update to 'expense_records' if necessary

    protected $fillable = ['expense_id', 'medicine_id', 'medicine_name', 'generic_name', 'quantity'];

    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class);
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class);
    }
}
