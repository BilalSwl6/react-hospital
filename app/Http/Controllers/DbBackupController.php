<?php

namespace App\Http\Controllers;

use App\Jobs\RunDatabaseBackup;
use App\Models\DbBackupRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DbBackupController extends Controller
{
    /**
     * List all backup records.
     *
     * @param Request $request
     */
    public function index(Request $request)
    {
        $records = DbBackupRecord::all();

        return Inertia::render('settings/backup-db', [
            'records' => $records,
        ]);
    }

    /**
     * Initiate a database backup job.
     */
    public function backup()
    {
        try {
            // Check if backup already exists for today
            $existing = DbBackupRecord::whereDate('date', today())->first();
            if ($existing) {
                Log::info('Backup already exists for today.');
                return response()->json([
                    'status' => 'error',
                    'message' => 'Backup already exists for today.',
                ], 400);
            }

            // Create backup record
            $record = DbBackupRecord::create([
                'date' => today(),
                'status' => DbBackupRecord::STATUS_PENDING,
            ]);

            // Dispatch the backup job
            RunDatabaseBackup::dispatch($record->id);

            return response()->json([
                'status' => 'success',
                'message' => 'Backup job has been dispatched successfully.',
                'data' => [
                    'record_id' => $record->id,
                    'date' => $record->date,
                    'status' => $record->status,
                ],
            ]);
        } catch (\Exception $e) {
            ([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            Log::error('Failed to dispatch backup job', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to dispatch backup job',
            ], 500);
        }
    }

    /**
     * Get backup status for a specific date or the latest backup.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function status(Request $request): JsonResponse
    {
        try {
            $date = $request->get('date', now()->toDateString());

            $record = DbBackupRecord::where('date', $date)->first();

            if (!$record) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No backup record found for the specified date.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'id' => $record->id,
                    'date' => $record->date->toDateString(),
                    'status' => $record->status,
                    'file_name' => $record->file_name,
                    'error_message' => $record->error_message,
                    'completed_at' => $record->completed_at?->toISOString(),
                    'created_at' => $record->created_at->toISOString(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve backup status', [
                'error' => $e->getMessage(),
                'date' => $request->get('date'),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve backup status.',
            ], 500);
        }
    }
}
