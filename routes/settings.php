<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\DbBackupController;
use App\Http\Controllers\Admin\ManageUserController;
use App\Http\Controllers\Admin\ManageRoleController;
use App\Http\Controllers\Admin\GeneralSettingController;
use App\Http\Controllers\Admin\MailSettingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::put('/backup/database', [DbBackupController::class, 'backup'])->name('backup.database');
    Route::get('/settings/backup', [DbBackupController::class, 'index'])->name('backup.index');
    Route::get('/backup/status', [DbBackupController::class, 'status']);
});


Route::prefix('admin')->middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/general');
    Route::resource('/users', ManageUserController::class)->except(['edit', 'create', 'show']);
    Route::resource('/roles', ManageRoleController::class)->except(['edit', 'create', 'show']);
    
    Route::get('settings/general', [GeneralSettingController::class, 'index'])->name('settings.general');
    Route::post('settings/general', [GeneralSettingController::class, 'update'])->name('settings.general.update');

    Route::get('settings/mail', [MailSettingController::class, 'index'])->name('settings.mail');
    Route::post('settings/mail', [MailSettingController::class, 'update'])->name('settings.mail.update');
    Route::post('settings/mail/test', [MailSettingController::class, 'test'])->name('settings.mail.test');
});