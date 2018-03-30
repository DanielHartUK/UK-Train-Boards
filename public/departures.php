<?php 
  if(isset($_GET['type'])) {
    switch ($_GET['type']) {
      case 'departures':
      default:
        $type = 'departures';
        $title = 'Departures';
        $locTitle = 'Destination';
        break;
      case 'arrivals':
        $type = 'arrivals';
        $title = 'Arrivals';
        $locTitle = 'Origin';
        break;
    }
  }
?>
<!DOCTYPE HTML>
<html>
<head>
  <?php require_once('../php/head.php'); ?>
  <title> Station <?php echo $title; ?> </title>
</head>
<body onload="startTime()">
  
  <div class="main">
    <h1> <?php echo $title; ?> </h1>
    <table class="departures">
      <thead>
        <tr class="departures__headings">
          <th id="dTime" class="dTime"> Time </th>
          <th id="dDest" class="dDest"> <?php echo $locTitle; ?> </th>
          <th id="dPlat" class="dPlat"> Plat </th>
          <th id="dExp" class="dExp"> Expected </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td headers="dTime" class="dTime"> 88:88 </td>
          <td headers="dDest" class="dDest"> London Paddington </td>
          <td headers="dPlat" class="dPlat"> 88B </td>
          <td headers="dExp" class="dExp"> Delayed </td>
        </tr>
        <tr>
          <td headers="dTime" class="dTime"> 11:11 </td>
          <td headers="dDest" class="dDest"> London Paddington </td>
          <td headers="dPlat" class="dPlat"> 11B </td>
          <td headers="dExp" class="dExp"> 11:11 </td>
        </tr>
        <tr>
          <td headers="dTime" class="dTime"> 12:11 </td>
          <td headers="dDest" class="dDest"> London Paddington </td>
          <td headers="dPlat" class="dPlat"> BUS </td>
          <td headers="dExp" class="dExp"> On Time </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="departuresEnd">
          <td class="xpage" colspan="2">Page 8 of 8 </td>
          <td class="clock" colspan="2"> </td>
        </tr>
      </tfoot>
  </div>

  <script src="js/jquery-3.1.1.min.js" type="text/javascript"></script>
  <script src="js/moment.js" type="text/javascript"></script>
  <script src="js/script.min.js" type="text/javascript"></script>
  <script> var type = '<?php echo $type; ?>'; </script>
  <!--<script src="js/get.min.js" type="text/javascript"></script>-->
</body>
</html>