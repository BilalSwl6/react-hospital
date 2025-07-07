<?php

namespace App\Jobs;

use App\Models\DbBackupRecord;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class RunDatabaseBackup implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $recordId;
    public int $tries = 3;
    public int $timeout = 3600;

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
        $record = DbBackupRecord::findOrFail($this->recordId);

        $record->update([
            'status' => DbBackupRecord::STATUS_RUNNING,
            'started_at' => now(),
        ]);

        try {
            // 1. Clean all old local backup files
            Storage::disk('local')->deleteDirectory('Laravel');
            Storage::disk('local')->makeDirectory('Laravel');

            // 2. Run the backup (local only)
            $exitCode = Artisan::call('backup:run', [
                '--only-db' => true,
                '--disable-notifications' => true,
            ]);

            if ($exitCode !== 0) {
                throw new \Exception('Backup command failed with exit code: ' . $exitCode);
            }

            // 3. Get the latest local backup file
            $localPath = $this->getLatestLocalBackupFile();
            $fileContents = Storage::disk('local')->get($localPath);
            $fileSize = Storage::disk('local')->size($localPath);

            // 4. Upload to GCS
            Storage::disk('gcs')->put($localPath, $fileContents);

            // 5. Delete the local file
            Storage::disk('local')->delete($localPath);

            // 6. Update DB record
            $record->update([
                'status' => DbBackupRecord::STATUS_COMPLETED,
                'file_name' => $localPath,
                'completed_at' => now(),
                'file_size' => $fileSize,
            ]);
        } catch (Throwable $e) {
            $record->update([
                'status' => DbBackupRecord::STATUS_FAILED,
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);

            throw $e;
        }
    }

    /**
     * Handle job failure after all retry attempts.
     */
    public function failed(Throwable $exception): void
    {
        $record = DbBackupRecord::find($this->recordId);
        if ($record) {
            $record->update([
                'status' => DbBackupRecord::STATUS_FAILED,
                'error_message' => 'Job failed after ' . $this->tries . ' attempts: ' . $exception->getMessage(),
                'completed_at' => now(),
            ]);
        }
    }

    /**
     * Get the latest backup file from local storage.
     */
    private function getLatestLocalBackupFile(): string
    {
        $files = collect(Storage::disk('local')->files('Laravel'));

        return $files
            ->filter(fn($file) => str_ends_with($file, '.zip'))
            ->sortDesc()
            ->first()
            ?? throw new \Exception('No local backup file found');
    }
}
