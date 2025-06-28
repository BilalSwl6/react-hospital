<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DbBackupRecords extends Model
{
    protected $table = 'db_backup_records';
    protected $fillable = [
        'date',
        'file_name',
        'status',
        'error_message',
        'completed_at',
    ];

    protected $casts = [
        'date' => 'date',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the date of the backup in a formatted way.
     *
     * @return string
     */

    public function getFormattedDateAttribute()
    {
        return $this->date->format('d-m-Y');
    }
}
