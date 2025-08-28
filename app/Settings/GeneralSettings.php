<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class GeneralSettings extends Settings
{
    public string $site_name;
    public string $site_description;
    public bool $site_active;
    public ?string $site_logo;
    public ?string $site_favicon;
    public string $user_timezone;
    public string $site_currency;
    public ?string $site_footer_credit;

    public static function group(): string
    {
        return 'general';
    }
}