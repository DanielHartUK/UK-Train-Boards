<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ServicesController extends Controller
{
    /**
     * Get the departures for a station
     *
     * @param string $stn The station code
     * @return array
     */
    public function getDepartures(string $stn): array
    {
        $services = [
            ['std' => '12:12'],
            ['std' => '12:12'],
            ['std' => '12:12'],
        ];

        return $services;
    }

    /**
     * Get the arrivals for a station
     *
     * @param string $stn The station code
     * @return array
     */
    public function getArrivals(string $stn): array
    {
        $services = [
            ['std' => '12:12'],
            ['std' => '12:12'],
            ['std' => '12:12'],
        ];

        return $services;
    }
}
