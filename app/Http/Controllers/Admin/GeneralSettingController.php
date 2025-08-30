<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Settings\GeneralSettings;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

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

        $disk = Storage::disk('r2');

        // Handle site_logo upload
        if ($request->hasFile('site_logo')) {
            if ($settings->site_logo) {
                // remove old file (strip URL if needed)
                $disk->delete(basename($settings->site_logo));
            }

            $extension = $request->file('site_logo')->getClientOriginalExtension();
            $filePath = 'logo_' . time() . '.' . $extension;

            $disk->putFileAs('', $request->file('site_logo'), $filePath);

            $settings->site_logo = env('R2_DEVELOPMENT_URL') . '/' . $filePath;
        }

        // Handle site_favicon upload
        if ($request->hasFile('site_favicon')) {
            if ($settings->site_favicon) {
                $disk->delete(basename($settings->site_favicon));
            }

            $extension = $request->file('site_favicon')->getClientOriginalExtension();
            $filePath = 'favicon_' . time() . '.' . $extension;

            $disk->putFileAs('', $request->file('site_favicon'), $filePath);

            $settings->site_favicon = env('R2_DEVELOPMENT_URL') . '/' . $filePath;
        }

        // Update other fields except logo & favicon
        $settings->fill(collect($validated)->except(['site_logo', 'site_favicon'])->toArray());

        $settings->save();

        return redirect()->back()->with('success', 'Settings updated successfully!');
    }
}
