<?php

namespace App\Http\Controllers;

use App\Jobs\RunDatabaseBackup;
use App\Models\DbBackupRecords;
use Illuminate\Http\Request;

class DbBackupController extends Controller
{
    public function backup()
    {
        $today = now()->toDateString();

        $record = DbBackupRecords::firstOrCreate(
            ['date' => $today],
            ['file_name' => null, 'status' => 'pending']
        );

        // Dispatch job to run in background
        RunDatabaseBackup::dispatch($record->id);

        return response()->json([
            'message' => 'Backup job dispatched.',
            'record'  => $record,
        ], 202);
    }
}
