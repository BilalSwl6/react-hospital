<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DbBackupRecord extends Model
{
    use HasFactory;

    protected $table = 'db_backup_records';

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_RUNNING = 'running';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'date',
        'file_name',
        'file_size',
        'status',
        'error_message',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'date' => 'date',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'file_size' => 'integer',
    ];

    /**
     * Get the formatted date attribute.
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->date->format('d-m-Y');
    }

    /**
     * Get human-readable file size.
     */
    public function getFormattedFileSizeAttribute(): ?string
    {
        if (!$this->file_size) {
            return null;
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = $this->file_size;
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get duration of backup process.
     */
    public function getDurationAttribute(): ?string
    {
        if (!$this->started_at || !$this->completed_at) {
            return null;
        }

        $duration = $this->completed_at->diffInSeconds($this->started_at);
        
        if ($duration < 60) {
            return $duration . ' seconds';
        } elseif ($duration < 3600) {
            return round($duration / 60, 1) . ' minutes';
        } else {
            return round($duration / 3600, 1) . ' hours';
        }
    }

    /**
     * Check if backup is in progress.
     */
    public function isInProgress(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_RUNNING]);
    }

    /**
     * Check if backup was successful.
     */
    public function isSuccessful(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Check if backup failed.
     */
    public function hasFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    /**
     * Scope for today's backups.
     */
    public function scopeToday($query)
    {
        return $query->where('date', now()->toDateString());
    }

    /**
     * Scope for successful backups.
     */
    public function scopeSuccessful($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    /**
     * Scope for failed backups.
     */
    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }
}
