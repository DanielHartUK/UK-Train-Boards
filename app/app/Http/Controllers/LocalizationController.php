<?php

namespace App\Http\Controllers;

use App;
use Illuminate\Http\Request;

class LocalizationController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

    }

    /**
     * Output the application's language strings
     *
     * @return array
     */
    public function strings(): array
    {
        $lang = config('app.locale');

        $files = glob(resource_path('lang/'.$lang.'/*.php'));
        $strings = [];

        foreach ($files as $file) {
            $name = basename($file, '.php');
            $strings[$name] = require $file;
        }

        return $strings;
    }

    /**
     * Output the application's language strings to the JS window
     */
    public function jsi18n()
    {
        if (App::environment('local')) {
            $strings = $this->strings();
        } else {
            $strings = Cache::rememberForever('lang.js', function () {
                $this->strings();
            });
        }

        header('Content-Type: text/javascript');
        echo('window.i18n = '.json_encode($strings).';');
        exit();
    }
}
