<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('mail.provider', 'smtp');
        $this->migrator->add('mail.host', 'smtp.gmail.com');
        $this->migrator->add('mail.port', 587);
        $this->migrator->add('mail.username', 'your_username');
        $this->migrator->add('mail.password', 'your_password', true);
        $this->migrator->add('mail.from_email', 'a@a.a');
        $this->migrator->add('mail.from_name', 'your_name');
        $this->migrator->add('mail.encryption', 'tls');
        $this->migrator->add('mail.settings', 'queue');
        $this->migrator->add('mail.mailgun_domain', 'your_domain');
        $this->migrator->add('mail.mailgun_secret', 'your_api_key', true);
        $this->migrator->add('mail.mailgun_endpoint', 'https://api.mailgun.net/');
        $this->migrator->add('mail.resend_key', 'your_api_key', true);
        $this->migrator->add('mail.is_env', true);
    }

    public function down(): void
    {
        $this->migrator->delete('mail.provider');
        $this->migrator->delete('mail.host');
        $this->migrator->delete('mail.port');
        $this->migrator->delete('mail.username');
        $this->migrator->delete('mail.password');
        $this->migrator->delete('mail.from_email');
        $this->migrator->delete('mail.from_name');
        $this->migrator->delete('mail.encryption');
        $this->migrator->delete('mail.settings');
        $this->migrator->delete('mail.mailgun_domain');
        $this->migrator->delete('mail.mailgun_secret');
        $this->migrator->delete('mail.mailgun_endpoint');
        $this->migrator->delete('mail.resend_key');
        $this->migrator->delete('mail.is_env');
    }
};
