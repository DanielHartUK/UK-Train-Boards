<?php
header("Content-Type: application/json");
require("../config.php");

if(!empty($_GET["station"])){
  if(isset($_GET['rows']) && $_GET['rows']) {
    $numRows = $_GET['rows'];
  } else {
    $numRows = 20;
  }
  //check which API we are using
  if(API == strtoupper("LDWS")){
    require("OpenLDBWS.php");
    $OpenLDBWS = new OpenLDBWS($token);
    $station = strtoupper($_GET['station']);

    $response = $OpenLDBWS->GetDepartureBoard($numRows, $station);

    if(isset($response->GetStationBoardResult->trainServices->service))
      $a1 = $response->GetStationBoardResult->trainServices->service;
    if(isset($response->GetStationBoardResult->busServices->service))
      $a2 = $response->GetStationBoardResult->busServices->service;

    if(isset($a2) && is_array($a2) != 1) {
      array_push($a1, $a2);
      $trainServicesResponse = $a1;
    } else if (isset($a1) && isset($a2)) {
      $trainServicesResponse = array_merge($a1, $a2);
    } else if (isset($a1)) {
      $trainServicesResponse = $a1;
    } else if (isset($a2)) {
      $trainServicesResponse = $a2;
    }

    function sortTime($a, $b) {
      if($a->std==$b->std) return 0;
      return ($a->std < $b->std) ? -1 : 1;
    }
    if(isset($trainServicesResponse)) {
      if(count($trainServicesResponse) > 1) {
        usort($trainServicesResponse, "sortTime");
      } else {
        $trainServicesResponse = array($trainServicesResponse);
      }
    }
    if(isset($trainServicesResponse)) { // Has departures
      echo json_encode($trainServicesResponse);
    } else if (isset($response) && !empty($response)) { // Reponse but no departures
      echo json_encode($response);
    } else { // No response
      echo json_encode("No response");
    }
  } elseif (API == strtoupper("RTT")) {
    require("rtt.php");

    $rtt = new rtt($username, $password);
    echo json_encode($rtt->getServices($_GET['station'], "departures", "low", $numRows));

  } else {
    echo "Error in config file";
  }
  
} else {
  echo "No station code supplied";
}