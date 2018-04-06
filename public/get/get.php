<?php
require("../../php/config.php");
require("../../php/OpenLDBWS.php");
$OpenLDBWS = new OpenLDBWS($token);
header("Content-Type: application/json");

if(isset($_GET['station']) && !empty($_GET['station']) && isset($_GET['type']) && !empty($_GET['type'])) { // Check station and type are set
  $station = strtoupper($_GET['station']); // Convert station code to uppercase
  if(checkStation($station)) { // Check station code is valid
    if(isset($_GET['rows']) && $_GET['rows']) {
      $numRows = $_GET['rows'];
    } else {
      $numRows = 20;
    }
    // Fetch data
    switch($_GET['type']) { 
      case "departures":
        $response = $OpenLDBWS->GetDepartureBoard($numRows, $station);
        break;
      case "arrivals":
        $response = $OpenLDBWS->GetArrivalBoard($numRows, $station);
        break;
      case "departuresdetailed":
        $response = $OpenLDBWS->GetDepBoardWithDetails($numRows, $station);
        break;
      case "arrivalsdetailed":
        $response = $OpenLDBWS->GetArrBoardWithDetails($numRows, $station);
        break;
      default:
        $response = "Invalid type";
        break;
    }
    // Merge bus and train services
    if(isset($response->GetStationBoardResult->trainServices->service))
      $a1 = $response->GetStationBoardResult->trainServices->service;
    if(isset($response->GetStationBoardResult->busServices->service))
      $a2 = $response->GetStationBoardResult->busServices->service;
    if(isset($response->GetStationBoardResult->ferryServices->service))
      $a3 = $response->GetStationBoardResult->ferryServices->service;

    // Merge services
    $trainServicesResponse = [];
    if (isset($a1) && !is_array($a1)) {
      array_push($trainServicesResponse, $a1);
    } else if (isset($a1)) {
      $trainServicesResponse = array_merge($trainServicesResponse, $a1);
    }
    if (isset($a2) && !is_array($a2)) {
      array_push($trainServicesResponse, $a2);
    } else if (isset($a2)) {
      $trainServicesResponse = array_merge($trainServicesResponse, $a2);
    }
    if (isset($a3) && !is_array($a3)) {
      array_push($trainServicesResponse, $a3);
    } else if (isset($a3)) {
      $trainServicesResponse = array_merge($trainServicesResponse, $a3);
    }

    // Sort services chronilogically
    if(!empty($trainServicesResponse) ) {
      if(count($trainServicesResponse) > 1) {
        usort($trainServicesResponse, "sortTime");
      } 
      echo json_encode($trainServicesResponse); // Echo services
  
    } else if (isset($response) && !empty($response)) { // Reponse but no departures
      echo json_encode($response);
    } else if($response == "Invalid type") {
      echo json_encode("Invalid type");
    } else { // No response
      echo json_encode("No response");
    }
  } else {
    echo json_encode("Invalid station code");
  }
} else if (!isset($_GET['type']) || empty($_GET['type'])) {
  echo json_encode("No type supplied");
} else if (!isset($_GET['station']) || empty($_GET['station'])) {
  echo json_encode("No station code supplied");
} else {
  echo json_encode("Error");
}

/**
 * Check a station code is valid
 * @param string $station the station code to check
 * @return bool true if station code is valid
 */
function checkStation($station) {
  $url = '../assets/stationCodes.json'; 
  $data = file_get_contents($url);
  $stationCodes = json_decode($data);

  if(isset($stationCodes->stations->$station)) {
    return true;
  } 
}

/**
 * Chronilogically sort two services arrays
 */
function sortTime($a, $b) {
  if(isset($a->std)) { // departures
    if($a->std==$b->std) return 0;
    return ($a->std < $b->std) ? -1 : 1;
  } else { // arrivals
    if($a->sta==$b->sta) return 0;
    return ($a->sta < $b->sta) ? -1 : 1;
  }
}
