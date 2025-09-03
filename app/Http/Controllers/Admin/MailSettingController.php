<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Settings\MailSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class MailSettingController extends Controller
{
    /**
     * Show settings page.
     */
    public function index(MailSettings $settings)
    {
        return Inertia::render('Admin/Setting/mail', [
            'mailSettings' => $settings
        ]);
    }

    /**
     * Save / Update mail settings.
     */
    public function update(Request $request, MailSettings $settings)
    {
        $validated = $request->validate([
            'provider' => 'required|in:smtp,mailgun,resend,env',
            'from_email' => 'required_if:provider,smtp,mailgun,resend|email|nullable',
            'from_name' => 'required_if:provider,smtp,mailgun,resend|string|nullable',
            'settings' => 'nullable|string|in:queue,sync',
            // SMTP
            'host' => 'required_if:provider,smtp|string|nullable',
            'port' => 'required_if:provider,smtp|numeric|nullable',
            'username' => 'required_if:provider,smtp|string|nullable',
            'password' => 'nullable|string', 
            'encryption' => 'required_if:provider,smtp|string|nullable|in:ssl,tls',
            // Mailgun
            'mailgun_domain' => 'required_if:provider,mailgun|string|nullable',
            'mailgun_secret' => 'nullable|string', 
            'mailgun_endpoint' => 'nullable|string',
            // Resend
            'resend_key' => 'nullable|string',
        ]);

        // Don’t overwrite secrets if left blank
        if (empty($validated['password'])) {
            unset($validated['password']);
        }
        if (empty($validated['mailgun_secret'])) {
            unset($validated['mailgun_secret']);
        }
        if (empty($validated['resend_key'])) {
            unset($validated['resend_key']);
        }

        $settings->fill($validated);
        $settings->save();  

        return back()->with('success', 'Mail settings updated successfully.');
    }

    /**
     * Send a test email.
     */
    public function test(Request $request, MailSettings $settings)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            Mail::raw(
                '✅ This is a test email sent using your current mail settings.',
                function ($message) use ($request, $settings) {
                    $message
                        ->to($request->email)
                        ->from($settings->from_email, $settings->from_name)
                        ->subject('Test Email');
                }
            );

            return back()->with('success', "Test mail sent to {$request->email}");
        } catch (\Exception $e) {
            return back()->withErrors([
                'email' => '❌ Failed to send test email: ' . $e->getMessage(),
            ]);
        }
    }
}
