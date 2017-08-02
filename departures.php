<!DOCTYPE HTML>
<html>
<head>
  <?php require_once('src/php/head.php'); ?>
  <title> Live departure board </title>
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
    <div class="departuresList">

    </div>
    <div class="departuresEnd">
      <p class="page"> </p>
      <p id="time"> </p>
    </div>
  </div>

  <script src="js/jquery-3.1.1.min.js" type="text/javascript"></script>
  <script src="js/script.min.js" type="text/javascript"></script>
  <script src="js/departures.min.js" type="text/javascript"></script>
</body>
</html>