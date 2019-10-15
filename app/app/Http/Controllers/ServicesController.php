<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ServicesController extends Controller
{
    protected $ldbws;

    public function __construct()
    {
        $this->ldbws = app('ldbws');
    }

    public function processServices(\stdClass $result)
    {
        $services = [];

        $serviceTypes = ['trainServices', 'busServices', 'ferryServices'];
        foreach ($serviceTypes as $type) {
            if (isset($result->$type->service)) {
                $typeServices = $result->$type->service;
                $services = array_merge($services,
                    is_array($typeServices) ? $typeServices : [$typeServices]
                );
            }
        }

        // Do some additional processing on each service, like figuring out time stamps
        // convert std/sta to scheduled, sort by time

        for ($i = 0; $i < sizeof($services); $i++) {
            $service = $services[$i];

            if (isset($service->std)) {
                $service->scheduled = $service->std;
                unset($service->std);
            }

            if (isset($service->sta)) {
                $service->expected = $service->sta;
                unset($service->sta);
            }

            if (isset($service->etd)) {
                $service->expected = $service->etd;
                unset($service->etd);
            }

            if (isset($service->eta)) {
                $service->expected = $service->eta;
                unset($service->eta);
            }



            $services[$i] = $service;
        }

        return $services;
    }

    /**
     * Get the departures for a station
     *
     * @param string $stn The station code
     * @return array
     */
    public function getDepartures(string $stn): array
    {
        $services = $this->processServices($this->ldbws->GetDepartureBoard(25, $stn)->GetStationBoardResult);

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
