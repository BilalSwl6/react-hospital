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

        $disk = Storage::disk('r2');

        if ($request->hasFile('site_logo')) {
            $disk->delete($settings->site_logo ?? ''); // Optional: delete old file
        
            $extension = $request->file('site_logo')->getClientOriginalExtension();
            $filePath = 'logo_' . time() . '.' . $extension;
        
            $disk->putFileAs('', $request->file('site_logo'), $filePath);
        
            // Save full URL instead of just filename
            $validated['site_logo'] = env('R2_DEVELOPMENT_URL') .'/'. $filePath;
        }
        
        if ($request->hasFile('site_favicon')) {
            $disk->delete($settings->site_favicon ?? '');
        
            $extension = $request->file('site_favicon')->getClientOriginalExtension();
            $filePath = 'favicon_' . time() . '.' . $extension;
        
            $disk->putFileAs('', $request->file('site_favicon'), $filePath);
        
            // Save full URL
            $validated['site_favicon'] = env('R2_DEVELOPMENT_URL') .'/'. $filePath;
        }
        

        $settings->fill($validated);
        $settings->save();

        return redirect()->back()->with('success', 'Settings updated successfully!');
    }
}
