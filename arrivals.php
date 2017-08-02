<!DOCTYPE HTML>
<html>
<head>
  <?php require_once('src/php/head.php'); ?>
  <title> Live arrivals board </title>
</head>
<body onload="startTime()">
  
  <div class="main">
    <h1> Arrivals </h1>
    <div class="departuresHeadings">
      <p class="std"> Time </p>
      <p class="destinationName"> Origin </p>
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
  <script src="js/arrivals.min.js" type="text/javascript"></script>
</body>
</html>