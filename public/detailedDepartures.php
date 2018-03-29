<!DOCTYPE HTML>
<html>
<head>
  <?php require_once('../php/head.php'); ?>
  <title> Live departure board with details </title>
</head>
<body>
  <div class="main">
    <div class="departuresList departuresDetailed">
      <div class="departureEntry bold heading">
        <p class="departureTime"></p>
        <div class="headingRight timePlat">
          <p class="departureTimeEstimated"></p>
          <p class="platform"></p>
        </div>
      </div>
      <div class="departureEntry bold heading">
        <p class="destinationName"></p>
      </div>
      <div class="departureEntry heading callingHeading">
        <p> Calling at: </p>
        <p class="callingPage">Page 1 of 1</p>
      </div>
      <div class="calling">

      </div>
      <div class="departureEntry" style="overflow: hidden;">
        <p class="serviceInformation animated"> </p>
      </div>
      <div class="departureEntry empty"><p>&nbsp;</p></div>
    </div>
  </div>

  <script src="js/jquery-3.1.1.min.js" type="text/javascript"></script>
  <script src="js/moment.js" type="text/javascript"></script>
  <script src="js/script.min.js" type="text/javascript"></script>
  <script src="js/departuresDetailed.min.js" type="text/javascript"></script>
</body>
</html>