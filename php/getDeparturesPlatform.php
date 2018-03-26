<?php
  // Gets 
  require("../config.php");
  require("OpenLDBWS.php");
  $OpenLDBWS = new OpenLDBWS($token);
  if(isset($_GET['station'])) {
    $station = strtoupper($_GET['station']);
    if(isset($_GET['rows']) && $_GET['rows']) {
      $numRows = $_GET['rows'];
    } else {
      $numRows = 150;
    }
    $response = $OpenLDBWS->GetDepartureBoard($numRows, $station);
    $responseDetailed = $OpenLDBWS->GetDepBoardWithDetails($numRows, $station);

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

    // Sort into platform array
    $platformArray = array();
    foreach($trainServicesResponse as $service) {
      if(isset($service->platform)) {
        if(!isset($platformArray[$service->platform])) {
          $platformArray[$service->platform] = array();
        }
        array_push($platformArray[$service->platform], $service);
      }
    }

    $response = null;
    $trainServicesResponse = null;


    if(isset($responseDetailed->GetStationBoardResult->trainServices->service))
      $a1 = $responseDetailed->GetStationBoardResult->trainServices->service;
    if(isset($responseDetailed->GetStationBoardResult->busServices->service))
      $a2 = $responseDetailed->GetStationBoardResult->busServices->service;
    
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

    if(isset($trainServicesResponse)) {
      if(count($trainServicesResponse) > 1) {
        usort($trainServicesResponse, "sortTime");
      } else {
        $trainServicesResponse = array($trainServicesResponse);
      }
    }

    // Replace with detailed departure where available
    foreach($trainServicesResponse as $service) {
      if($platformArray[$service->platform] != null) {
        foreach($platformArray[$service->platform] as $platServiceID => $platService) {
          if($platService->serviceID === $service->serviceID) {
            $platformArray[$service->platform][$platServiceID] = $service;
          }
        }
      }
    }

    if(isset($platformArray)) { // Has departures
      header("Content-Type: application/json");
      echo json_encode($platformArray);
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
