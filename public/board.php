<?php 
  if(isset($_GET['type'])) {
    switch (strtolower($_GET['type'])) {
      case 'departures':
        $type = 'departures';
        $title = 'Departures';
        $locTitle = 'Destination';
        break;
      case 'arrivals':
        $type = 'arrivals';
        $title = 'Arrivals';
        $locTitle = 'Origin';
        break;
      default:
        $type = null;
        $title = 'Departures';
        $locTitle = 'Destination';
        break;
    }
  } else {
    $type = null;
    $title = 'Departures';
    $locTitle = 'Destination';
  }
?>
<!DOCTYPE HTML>
<html>
<head class="board">
  <?php require_once('../php/head.php'); ?>
  <title> Station <?php echo $title; ?> </title>
</head>
<body onload="startClock('.clock')">
  <div class="main">
    <h1> <?php echo $title; ?> </h1>
    <table id="departures" class="departures">
      <thead>
        <tr class="departures__headings">
          <th id="dTime" class="dTime"> Time </th>
          <th id="dDest" class="dDest"> <?php echo $locTitle; ?> </th>
          <th id="dPlat" class="dPlat"> Plat </th>
          <th id="dExp" class="dExp"> Expected </th>
        </tr>
      </thead>
      <tbody>

      </tbody>
      <tfoot>
        <tr class="departures__footer">
          <td colspan="4">
            <span class="page"></span>
            <span class="status"> </span>
            <span class="clock" colspan="2"> </span>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <script src="js/jquery-3.1.1.min.js" type="text/javascript"></script>
  <script src="js/moment.js" type="text/javascript"></script>
  <script src="js/script.min.js" type="text/javascript"></script>
  <script> const TYPE = '<?php echo $type; ?>'; </script>
  <script src="js/get.min.js" type="text/javascript"></script>
</body>
</html>