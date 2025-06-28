<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\DbBackupRecords;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Throwable;


class RunDatabaseBackup implements ShouldQueue
{
    use Dispatchable, Queueable, SerializesModels;

    public int $recordId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $recordId)
    {
        $this->recordId = $recordId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $record = DbBackupRecords::findOrFail($this->recordId);
        $record->update(['status' => 'started']);

        try {
            // Run spatie backup: only DB, silence notifications
            Artisan::call('backup:run', [
                '--only-db'               => true,
                '--disable-notifications' => true,
            ]);

            // Find latest backup file on R2
            $files = Storage::disk('r2')->files('backups/' . now()->format('Y-m-d'));
            $latest = collect($files)->sort()->last();

            $record->update([
                'status'       => 'completed',
                'file_name'    => $latest,
                'completed_at' => now(),
            ]);
        } catch (Throwable $e) {
            $record->update([
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }
    }
}
