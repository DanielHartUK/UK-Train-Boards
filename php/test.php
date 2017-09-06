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
    $response = $OpenLDBWS->GetDepBoardWithDetails($numRows, $station);

    

    if(isset($response)) { // Has departures
      header("Content-Type: application/json");
      echo json_encode($response);
    } else if (isset($response) && !empty($response)) { // Reponse but no departures
      header("Content-Type: application/json");
      echo json_encode("No departures");
    } else { // No response
      header("Content-Type: application/json");
      echo json_encode("No response");
    }
  } else {
    echo "No station code supplied";
  }
