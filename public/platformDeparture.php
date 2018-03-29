<!DOCTYPE HTML>
<html>
<head>
  <?php require_once('../php/head.php'); ?>
  <title> Live departure board with details </title>
</head>
<body onload="startTime()">

  <div class="platformBoard">
    <div class="departureEntry row"><div class="wipe"></div> <p>&nbsp;</p></div>    
    <div class="departureEntry row"><div class="wipe"></div> <p>&nbsp;</p></div>    
    <div class="departureEntry row"><div class="wipe"></div> <p>&nbsp;</p></div>    
    <div class="time" style="display: none;"><p id="time"></p></div>    
  </div>

  <script src="js/jquery-3.1.1.min.js" type="text/javascript"></script>
  <script src="js/moment.js" type="text/javascript"></script>
  <script src="js/script.min.js" type="text/javascript"></script>
  <script src="js/platformDepartures.min.js" type="text/javascript"></script>
</body>
</html>