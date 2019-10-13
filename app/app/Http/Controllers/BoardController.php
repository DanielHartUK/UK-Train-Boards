<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BoardController extends Controller
{
    /**
     * Get the standard board view
     *
     * @param int $type The board type (departures or arrivals)
     * @param string $station The station code
     * @param int $page The page to display
     * @return \Illuminate\View\View
     */
    private function standardBoard(string $type, string $station, int $page): \Illuminate\View\View
    {
        return view('board', [
            'type' => $type,
            'station' => $station,
            'page' => $page
        ]);
    }

    /**
     * Get the departures board view
     *
     * @param string $station The station code
     * @param int $page The page to display
     * @return \Illuminate\View\View
     */
    public function departuresBoard(string $station, int $page = 1): \Illuminate\View\View
    {
        return $this->standardBoard('departures', $station, $page);
    }

    /**
     * Get the arrivals board view
     *
     * @param string $station The station code
     * @param int $page The page to display
     * @return \Illuminate\View\View
     */
    public function arrivalsBoard(string $station, int $page = 1): \Illuminate\View\View
    {
        return $this->standardBoard('arrivals', $station, $page);
    }
}
