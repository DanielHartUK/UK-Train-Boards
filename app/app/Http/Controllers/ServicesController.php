<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ServicesController extends Controller
{
    protected $ldbws;

    public function __construct()
    {
        date_default_timezone_set('Europe/London');
        $this->ldbws = app('ldbws');
    }

    /**
     * Process the services from a API result
     *
     * @param \stdClass $result
     * @return array
     */
    public function processServices(\stdClass $result)
    {
        $services = [];

        // Merge the three service types into $services
        $serviceTypes = ['trainServices', 'busServices', 'ferryServices'];
        foreach ($serviceTypes as $type) {
            if (isset($result->$type->service)) {
                $typeServices = $result->$type->service;
                $services = array_merge($services,
                    is_array($typeServices) ? $typeServices : [$typeServices]
                );
            }
        }

        // Loop through the services, if the time of day has passed
        // assume the service is scheduled for tomorrow.
        $timeNow = time();
        $today = [];
        $tomorrow = [];

        for ($i = 0; $i < sizeof($services); $i++) {
            $service = $services[$i];

            $service->scheduled = $service->std ?? $service->sta ?? 'TBC';
            $service->expected = $service->etd ?? $service->eta ?? 'TBC';
            unset($service->std, $service->sta, $service->etd, $service->eta);

            if ($service->scheduled != 'TBC') {
                // If expected is a time, use it to decide if the service is today
                if (preg_match("^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$^",
                    $service->expected)) {
                    if (strtotime($service->scheduled) > $timeNow - (60 * 5)) {
                        $today[] = $service;
                    } else {
                        $tomorrow[] = $service;
                    }
                } else {
                    // If service is delayed, or scheduled for a time in the future, add it to today
                    if ($service->expected == 'Delayed' ||
                        strtotime($service->scheduled) > $timeNow - (60 * 5)) {
                        $today[] = $service;
                    } else {
                        $tomorrow[] = $service;
                    }
                }
            }
        }

        // Sort the services arrays, then merge into one
        usort($today, [$this, 'sortServices']);
        usort($tomorrow, [$this, 'sortServices']);
        $services = array_merge($today, $tomorrow);

        return $services;
    }

    /**
     * Sort function for services usort
     *
     * @param $a
     * @param $b
     * @return bool
     */
    private static function sortServices($a, $b)
    {
        return strtotime($a->scheduled) > strtotime($b->scheduled);
    }

    /**
     * Get the departures for a station
     *
     * @param string $stn The station code
     * @return array
     */
    public function getDepartures(string $stn): array
    {
        return $this->processServices($this->ldbws->GetDepartureBoard(100, $stn)
            ->GetStationBoardResult);
    }

    /**
     * Get the arrivals for a station
     *
     * @param string $stn The station code
     * @return array
     */
    public function getArrivals(string $stn): array
    {
        return $this->processServices($this->ldbws->GetArrivalBoard(100, $stn)
            ->GetStationBoardResult);
    }
}
