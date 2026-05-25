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
            
            $apiKey = $config['api_key'] ?? null;
            $dsnString = $config['dsn'] ?? null;
            
            // If they put the raw key in BREVO_API_KEY
            if ($apiKey) {
                $dsnString = 'brevo+api://' . $apiKey . '@default';
            }
            
            // If they put the raw key in BREVO_DSN by mistake (no scheme)
            if ($dsnString && !str_contains($dsnString, '://')) {
                $dsnString = 'brevo+api://' . $dsnString . '@default';
            }
            
            if (!$dsnString) {
                throw new \Exception('Brevo API key is missing. Please add BREVO_API_KEY to your Render environment variables.');
            }
            
            return $factory->create(\Symfony\Component\Mailer\Transport\Dsn::fromString($dsnString));
        });
    }
}
