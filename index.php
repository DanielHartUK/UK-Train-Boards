<!DOCTYPE HTML>
<html>
<head>
  <?php require_once('src/php/head.php'); ?>
  <title> UK Railway Stations Information Boards </title>
</head>
<body>
  
  <div class="main">
    <h1> UK Railway Stations Information Boards </h1>
    <form class="options">
      <h2> Options </h2>
      <div class="flex">
        <label for="station">Station code: <br>
        <input type="text" name="station" id="station" minlength="3" maxlength="3" value="BHM" required></label>
        <label for="pages">Number of pages: <br>
        <input type="number" name="pages" id="pages" required value="1" ></label>
        <label for="page">Page to display: <br>
        <input type="number" name="page" id="page" required value="1" ></label>
        <label for="callouts">Platform callouts: <br>
        <input type="checkbox" name="callouts" id="callouts" value="true"></label>
      </div>
      <h3> Board </h3>
      <div class="flex boards">
        <label class="selected">
          <img src="assets/boardImages/departures.jpg" alt="Departures board"><br>
          <input type="radio" name="board" value="departures" checked required> Departures
        </label>
        <label>
          <img src="assets/boardImages/arrivals.jpg" alt="Arrivals board"><br>
          <input type="radio" name="board" value="arrivals" required> Arrivals
        </label>
        <!--<label>
          <img src="assets/boardImages/arrivals.jpg" alt="Platform board"><br>
          <input type="radio" name="board" value="platform" required> Platform departures
        </label>-->
      </div>

      <input type="submit" value="Generate">
    </form>
  </div>

  <script src="js/jquery-3.1.1.min.js" type="text/javascript"></script>
  <script src="js/script.min.js" type="text/javascript"></script>
  <script>
    $('.options').submit(function(e) {
      e.preventDefault();
      var station = $('input[name=station]').val();
      var pages = $('input[name=pages]').val();
      var page = $('input[name=page]').val();
      var boardType = $('input[name=board]:checked').val();
      if($('input[name=callouts]:checked').length) {
        var callouts = true;
      } else {
        var callouts = false;
      }  
      if(boardType === "departures") {
        window.location.assign("/departures.php?station=" + station + "&pages=" + pages + "&page=" + page + "&speak=" + callouts);
      } else if (boardType === "arrivals") {
        window.location.assign("/arrivals.php?station=" + station + "&pages=" + pages + "&page=" + page);
      }
    });
    $('input[type=radio][name=board]').change(function() {
      $('label.selected').removeClass('selected');
      $(this).parent().addClass('selected');
    })
  </script>
</body>
</html>