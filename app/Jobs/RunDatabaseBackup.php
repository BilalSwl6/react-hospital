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
    public int $timeout = 3600; // 1 hour timeout

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

        Log::info('Starting database backup', ['record_id' => $this->recordId]);

        $record->update([
            'status' => DbBackupRecord::STATUS_RUNNING,
            'started_at' => now(),
        ]);

        try {
            // Run spatie backup: only DB, disable notifications
            $exitCode = Artisan::call('backup:run', [
                '--only-db' => true,
                '--disable-notifications' => true,
            ]);

            if ($exitCode !== 0) {
                throw new \Exception('Backup command failed with exit code: ' . $exitCode);
            }

            $latestFile = $this->getLatestBackupFile();

            $record->update([
                'status' => DbBackupRecord::STATUS_COMPLETED,
                'file_name' => $latestFile,
                'completed_at' => now(),
                'file_size' => $this->getFileSize($latestFile),
            ]);

            Log::info('Database backup completed successfully', [
                'record_id' => $this->recordId,
                'file_name' => $latestFile,
            ]);

        } catch (Throwable $e) {
            Log::error('Database backup failed', [
                'record_id' => $this->recordId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $record->update([
                'status' => DbBackupRecord::STATUS_FAILED,
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);

            throw $e; // rethrow for retry
        }
    }

    /**
     * Handle job failure after all retry attempts.
     */
    public function failed(Throwable $exception): void
    {
        Log::critical('Database backup job failed permanently', [
            'record_id' => $this->recordId,
            'error' => $exception->getMessage(),
        ]);

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
     * Get the size of the backup file in bytes from GCS.
     */
    private function getFileSize(string $filePath): ?int
    {
        try {
            return Storage::disk('gcs')->size($filePath);
        } catch (\Exception $e) {
            Log::warning('Could not determine backup file size', [
                'file' => $filePath,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Get the latest backup file path on GCS.
     */
    private function getLatestBackupFile(): string
    {
        $files = collect(Storage::disk('gcs')->files('Laravel'));

        return $files
            ->filter(fn($file) => str_ends_with($file, '.zip'))
            ->sortDesc()
            ->first()
            ?? throw new \Exception('No backup file found in GCS');
    }
}
