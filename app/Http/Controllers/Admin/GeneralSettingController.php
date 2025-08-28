<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GeneralSettingController extends Controller
{
    /*
     * return
     */
    public function index(GeneralSettings $settings)
    {
        return Inertia::render('Admin/Setting/general', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, GeneralSettings $settings)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|min:3',
            'site_description' => 'nullable|string',
            'site_active' => 'required|boolean',
            'user_timezone' => 'required|string',
            'site_currency' => 'required|string',
            'site_footer_credit' => 'nullable|string',
            'site_logo' => 'nullable|file|image|max:2048',
            'site_favicon' => 'nullable|file|image|max:1024'
        ]);

        // Handle site_logo
        if ($request->hasFile('site_logo')) {
            if ($settings->site_logo && Storage::disk('public')->exists($settings->site_logo)) {
                Storage::disk('public')->delete($settings->site_logo);
            }

            $extension = $request->file('site_logo')->getClientOriginalExtension();
            $filePath = 'logo.' . $extension;
            $request->file('site_logo')->storeAs('', $filePath, 'public');

            $validated['site_logo'] = $filePath;
        }

        // Handle site_favicon
        if ($request->hasFile('site_favicon')) {
            if ($settings->site_favicon && Storage::disk('public')->exists($settings->site_favicon)) {
                Storage::disk('public')->delete($settings->site_favicon);
            }

            $extension = $request->file('site_favicon')->getClientOriginalExtension();
            $filePath = 'favicon.' . $extension;
            $request->file('site_favicon')->storeAs('', $filePath, 'public');

            $validated['site_favicon'] = $filePath;
        }

        // Update only filled fields or uploaded files
        foreach ($validated as $key => $value) {
            if ($request->filled($key) || $request->hasFile($key)) {
                $settings->$key = $value;
            }
        }

        $settings->save();

        return redirect()->back()->with('success', 'Settings updated successfully!');
    }
}
