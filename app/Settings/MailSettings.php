<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class MailSettings extends Settings
{

    public string $provider;
    public string $host;
    public string $port;
    public string $username;
    public string $password;
    public string $from_email;
    public string $from_name;
    public string $encryption;
    public string $settings;
    public string $mailgun_domain;
    public string $mailgun_secret;
    public string $mailgun_endpoint;
    public string $resend_key;
    public bool $is_env;


    public static function group(): string
    {
        return 'mail';
    }
}