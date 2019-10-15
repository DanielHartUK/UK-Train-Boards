<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\OpenLDBWS;

class OpenLDBWSServiceProvider extends ServiceProvider
{
    protected $defer = false;

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('ldbws', function () {
            return new OpenLDBWS(true);
        });

    }
}
