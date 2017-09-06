<?php
  require("../config.php");
  require("OpenLDBWS.php");
  $OpenLDBWS = new OpenLDBWS($token);
  if(isset($_GET['station'])) {
    $station = strtoupper($_GET['station']);
    if(isset($_GET['rows']) && $_GET['rows']) {
      $numRows = $_GET['rows'];
    } else {
      $numRows = 20;
    }
    $response = $OpenLDBWS->GetArrivalBoard($numRows, $station);

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
      if($a->sta==$b->sta) return 0;
      return ($a->sta < $b->sta) ? -1 : 1;
    }
    if(isset($trainServicesResponse)) {
      if(count($trainServicesResponse) > 1) {
        usort($trainServicesResponse, "sortTime");
      } else {
        $trainServicesResponse = array($trainServicesResponse);
      }
    }
    if(isset($trainServicesResponse)) { // Has departures
      header("Content-Type: application/json");
      echo json_encode($trainServicesResponse);
    } else if (isset($response) && !empty($response)) { // Reponse but no departures
      header("Content-Type: application/json");
      echo json_encode($response);
    } else { // No response
      header("Content-Type: application/json");
      echo json_encode("No response");
    }
  } else {
    echo "No station code supplied";
  }
