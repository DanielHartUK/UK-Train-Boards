<!DOCTYPE HTML>
<html>
<head>
  <?php require_once('../php/head.php'); ?>
  <title> UK Railway Stations Information Boards </title>
</head>
<body>
  
  <div class="main">
    <h1> UK Railway Stations Information Boards </h1>
    <form class="options">
      <h2> Options </h2>
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
      </div>
      <div class="flex">
        <label for="station">Station code: <br>
        <input type="text" name="station" id="station" minlength="3" maxlength="3" value="BHM" required></label>
        <div class="depInput inputGroup">
          <label for="page">Page to display: <br>
          <input type="number" name="page" id="page" required value="1" ></label>
        </div>
      </div>
      <input type="submit" value="Generate">
    </form>
  </div>

  <script src="js/jquery-3.1.1.min.js" type="text/javascript"></script>
  <script src="js/script.min.js" type="text/javascript"></script>
  <script>
    $('[name="board"]').change(function(e) {
      var el = $('[name="board"]:checked');
      console.log(el.val())
      if(el.val() === "departures" || el.val() === "arrivals") {
        $('.depDetInput').hide();
        $('.depInput').show();
      } else if(el.val() === "detailedDepartures") {
        $('.depDetInput').show();
        $('.depInput').hide();
      }
    });

    $('.options').submit(function(e) {
      e.preventDefault();
      var station = $('input[name=station]').val();
      var page = $('input[name=page]').val();
      var boardType = $('input[name=board]:checked').val();
      window.location.assign(`/board.php?station=${station}&type=${boardType}&page=${page}`);
    });
    $('input[type=radio][name=board]').change(function() {
      $('label.selected').removeClass('selected');
      $(this).parent().addClass('selected');
    })
  </script>
</body>
</html>