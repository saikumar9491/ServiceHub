<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;
use App\Models\PersonalAccessToken;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        \Illuminate\Support\Facades\Mail::extend('brevo', function (array $config) {
            $factory = new \Symfony\Component\Mailer\Bridge\Brevo\Transport\BrevoTransportFactory();
            return $factory->create(\Symfony\Component\Mailer\Transport\Dsn::fromString(env('BREVO_DSN')));
        });
    }
}
