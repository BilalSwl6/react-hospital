<?php

namespace App\Providers;

use App\Settings\MailSettings;
use App\Settings\GeneralSettings;
use Illuminate\Support\Facades\Config;
// use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(GeneralSettings $generalSettings, MailSettings $mailSettings): void
    {
        if ($generalSettings->site_name) {
            Config::set('app.name', $generalSettings->site_name);
        }
        // Force HTTPS in production
        // URL::forceScheme('https');
        if ($mailSettings->provider !== 'env') {
            Config::set('mail.from.address', $mailSettings->from_email);
            Config::set('mail.from.name', $mailSettings->from_name);

            if ($mailSettings->provider === 'smtp') {
                Config::set('mail.default', 'smtp');

                Config::set('mail.mailers.smtp', [
                    'transport' => 'smtp',
                    'host' => $mailSettings->host,
                    'port' => $mailSettings->port,
                    'encryption' => $mailSettings->encryption, 
                    'username' => $mailSettings->username,
                    'password' => $mailSettings->password,
                ]);
            } elseif ($mailSettings->provider === 'resend') {
                Config::set('mail.default', 'resend');

                Config::set('services.resend', [
                    'key' => $mailSettings->resend_key,
                ]);
            } elseif ($mailSettings->provider === 'mailgun') {
                Config::set('mail.default', 'mailgun');

                Config::set('services.mailgun', [
                    'domain' => $mailSettings->mailgun_domain,
                    'secret' => $mailSettings->mailgun_secret,
                    'endpoint' => $mailSettings->mailgun_endpoint,
                ]);
            }
        }
    }
}
