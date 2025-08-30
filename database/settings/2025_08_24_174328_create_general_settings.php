<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.site_name', 'HMS - Hospital Pharmacy Managment');
        $this->migrator->add('general.site_description', 'HMS - Hospital Pharmacy Managment');
        $this->migrator->add('general.site_active', True);
        $this->migrator->add('general.site_logo', '/logo.png');
        $this->migrator->add('general.site_favicon', '/favicon.png');
        $this->migrator->add('general.user_timezone', 'Asia/Karachi');
        $this->migrator->add('general.site_currency', 'RS');
        $this->migrator->add('general.site_footer_credit','<a href="https://www.facebook.com/Bilalswl.6" target="_blank">Bilal</a>');
    }

    public function down(): void
    {
        $this->migrator->deleteIfExists('general.site_name');
        $this->migrator->deleteIfExists('general.site_description');
        $this->migrator->deleteIfExists('general.site_active');
        $this->migrator->deleteIfExists('general.site_logo');
        $this->migrator->deleteIfExists('general.site_favicon');
        $this->migrator->deleteIfExists('general.user_timezone');
        $this->migrator->deleteIfExists('general.site_currency');
        $this->migrator->deleteIfExists('general.site_footer_credit');
    }
};
