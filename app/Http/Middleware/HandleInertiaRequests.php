<?php

namespace App\Http\Middleware;

// use Illuminate\Foundation\Inspiring;
use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        /** @var \Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard $auth */
        $auth = auth();
        // [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        $settings = app(GeneralSettings::class);
        // dd($settings->site_footer_credit);

        return [
            ...parent::share($request),
            // 'name' => config('app.name'),
            'appEnv' => config('app.env'),
            // 'quote' => ['message' => trim($message), 'author' => trim($author)],
            /** @noinspection PhpUndefinedMethodInspection */
            'auth' => [
                'user' => $request->user(),
                'permissions' => $auth->check()
                    ? $auth->user()->getAllPermissions()->pluck('name')
                    : [],
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
            'settings' => [
                'name' => $settings->site_name,
                'description' => $settings->site_description,
                'logo' => $settings->site_logo
                    ? asset('storage/' . $settings->site_logo)
                    : null,
                'favicon' => $settings->site_favicon
                    ? asset('storage/' . $settings->site_favicon)
                    : null,
                'active' => $settings->site_active,
                'timezone' => $settings->user_timezone,
                'currency' => $settings->site_currency,
                'footer_credit' => $settings->site_footer_credit,
            ],
        ];
    }
}
