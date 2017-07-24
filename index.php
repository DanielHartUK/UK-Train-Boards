<?php
  require("src/php/OpenLDBWS.php");
  require_once("config.php");
  $OpenLDBWS = new OpenLDBWS($token);
  if(isset($_GET['station'])) {
    $station = strtoupper($_GET['station']);
    $response = $OpenLDBWS->GetDepBoardWithDetails(60, $station);

    if(isset($response->GetStationBoardResult)) {
      $validStation = true;
    } else {
      $validStation = false;
    }

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
    if(isset($_GET['plain'])) {
      header("Content-Type: text/plain");
      print_r($trainServicesResponse);
    }
  }

  $delayReasonEnabled = false;
?>

<!DOCTYPE HTML>
<html>
<head>
  <?php require_once('src/php/head.php'); ?>
  <title> Live departure board </title>
  <meta http-equiv="refresh" content="60">
</head>
<body onload="startTime()">
  
  <div class="main">
    <h1> Departures </h1>
    <div class="departuresHeadings">
      <p class="std"> Time </p>
      <p class="destinationName"> Destination </p>
      <p class="platform"> Plat </p>
      <p class="etd"> Expected </p>
    </div>
    <?php 
      $d = 0;
      if(isset($trainServicesResponse) && !empty($trainServicesResponse)) {
        foreach ($trainServicesResponse as $trainService) {
          echo '<div class="departureEntry"><div class="departureRow">';
          
          echo '<p class="std">';
          if(isset($trainService->std))
            echo $trainService->std;
          echo '</p>';
          
          echo '<p class="destinationName">';
          if(isset($trainService->destination->location) && is_array($trainService->destination->location)) {
            $i = 0;
            foreach ($trainService->destination->location as $destination) {
              if($i != 0)
                echo ' & ';
              echo '<a href="?station=' . $destination->crs . '">' . $destination->locationName . '</a>';
              $i++;
            }
          } else if (isset($trainService->destination->location)) {
            echo '<a href="?station=' . $trainService->destination->location->crs . '">' . $trainService->destination->location->locationName . '</a>';
          }
          echo '</p>';

          echo '<p class="platform">';
          if($trainService->serviceType != 'train') {
            echo $trainService->serviceType;
          } else if (isset($trainService->platform)) {
            echo $trainService->platform;
          }
          echo '</p>';

          echo '<p class="etd">';
          if(isset($trainService->etd))
            echo $trainService->etd;
          echo '</p>';

          echo '</div><div class="departureRow">';
          if(isset($trainService->delayReason) && $delayReasonEnabled) {
            echo '<div class="std"></div><p class="delayReason">' . $trainService->delayReason . '</p>';
          } else if (isset($trainService->operator)) {
            echo '<div class="opStdPad"></div><p class="operator">' . $trainService->operator . '</p>';

            if(isset($trainService->subsequentCallingPoints->callingPointList->callingPoint) && !empty($trainService->subsequentCallingPoints->callingPointList->callingPoint)) { 
              echo '<p class="calling">Calling at: ';
              $i = 0;
              $len = count($trainService->subsequentCallingPoints->callingPointList->callingPoint);
              if($len > 1) {
                foreach($trainService->subsequentCallingPoints->callingPointList->callingPoint as $callingPoint) {
                  if($callingPoint->et != 'Cancelled') {
                    echo '<span class="callingPoint"><a href="?station=' . $callingPoint->crs . '">' . $callingPoint->locationName . '</a></span>';
                    if($i == $len - 1) {
                      echo '.';
                    } else {
                      echo ',&nbsp;';
                    }
                    $i++;
                  }
                }
              } else {
                if($trainService->subsequentCallingPoints->callingPointList->callingPoint->et != 'Cancelled') {
                  echo '<span class="callingPoint"><a href="?station=' . $trainService->subsequentCallingPoints->callingPointList->callingPoint->crs . '">' . $trainService->subsequentCallingPoints->callingPointList->callingPoint->locationName . '</a> only.</span>';
                }
              }
              echo '</p>';
            }
          }
          echo '</div></div>';
          $d++;
        } 
      } else if(!isset($_GET['station']) || $validStation === false) {
        echo '<div class="departureEntry"><div class="departureRow"><p class="delayReason">Station not specified</p></div><div class="departureRow"><p>&nbsp;</p></div></div>';
        $d++;
      }
      while($d < 15) {
        echo '<div class="departureEntry"><div class="departureRow"><p>&nbsp;</p></div><div class="departureRow"><p>&nbsp;</p></div></div>';
        $d++;
      }
    ?>
    <div class="departuresEnd">
      <p class="page"> Page 1 of 1 </p>
      <p id="time"> </p>
    </div>
  </div>

  <script src="js/jquery-3.1.1.min.js" type="text/javascript"></script>
  <script src="js/script.min.js" type="text/javascript"></script>
  <script>
    $(document).ready(function() {
      $('.calling').each(function() {
        var el = this;
        var elLength = $(el).outerWidth();
        var scrollDuration = elLength;
        var curScroll = 0;
        var duration = (elLength+800)/100;
        console.log(duration * 1000);
        function calling() {
          setTimeout(function() {
            $(el).css('transition', '').css('right', '');
            $(el).parent().find('.opStdPad, .operator').css('transition', '1s linear top').css('top', '46px');
            $(el).css('top', '-46px');
          }, 10000);
          setTimeout(function() { 
            $(el).css('transition', duration + 's linear').css('right', elLength);
          }, 12000);
          setTimeout(function() {
            console.log('x')
            $(el).parent().find('.opStdPad, .operator').css('top', '');
            $(el).css('transition', '').css('top', '');
            calling();
          }, duration*1000 + 12000);
        };
        calling();
      });
    });
    
  </script>
</body>
</html>