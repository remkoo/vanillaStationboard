var stationBoardTable;

function load(){
    var stationName = getStation();
    var url = "https://transport.opendata.ch/v1/stationboard?station="+stationName+"&limit=20";
    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
        if (request.status >= 200 && request.status < 300) {
            var responseData = JSON.parse(request.responseText);
            renderStaionboard(responseData);
          console.log(responseData);
        } else {
            console.warn(request.statusText, request.responseText);
        }
    });
    request.open("GET",url);
    request.send();
}

function startTimers() {
    setInterval(renderTime, 500);
    setInterval(load, 10000);
}

function renderStaionboard(responseData) {
    renderStationBoardTitle(responseData.station.name);
    renderStationboardTable(responseData.stationboard);
    renderUpdateTime();
}

function renderStationBoardTitle(stationName){
    document.getElementById("stationName").innerText = "Abfahrt " + stationName;
}

function renderTime(){
    var time = getLongTimeString(new Date());
    document.getElementById("time").innerText = ""+time;
}

function renderUpdateTime(){
    var time = getShortTimeString(new Date());
    document.getElementById("updateTime").innerText = "aktualisiert um "+time;
}

function renderStationboardTable(stationBoard){
    stationBoardTable = document.getElementById("stationboardBody");
    while (stationBoardTable.firstChild) {
        stationBoardTable.removeChild(stationBoardTable.firstChild);
      }
    stationBoard.forEach(renderJourney);
    /*
    var stationboardBody = document.getElementById("stationboardBody");
    var stationboard = document.getElementById("stationboard");
    stationboard.replaceChild(stationBoardTable,stationboardBody);
    */
}

function renderJourney(journey) {
    var journeyRow = document.createElement("tr"); 

    var departureTime = document.createElement("td");
    var time = getShortTimeString(new Date(journey.stop.departureTimestamp * 1000));
    var connection = getConnectionName(journey);
    departureTime.innerHTML = time + " " + connection;
    journeyRow.appendChild(departureTime);

    var destination = document.createElement("td");
    destination.innerText = journey.to;
    journeyRow.appendChild(destination);

    var platform = document.createElement("td");
    platform.innerText = journey.stop.platform;
    journeyRow.appendChild(platform);

    var delay = document.createElement("td");
    delay.innerText = journey.stop.delay;
    journeyRow.appendChild(delay);

    stationBoardTable.appendChild(journeyRow);
}

function getConnectionName (connection) {
    var number = parseInt(connection.number);
    number = isNaN(number) ? "" : number;
    var className = "connectionLogo " + connection.category;
    return "<div class='"+className+"'>"+connection.category + number + "</div>";
}

function getStation() {
    //var url = new URL(window.location.href);
    //var station = url.searchParams.get("station");
    //return station ? station : "Thalwil";
    return "Thalwil";
  }

  //utils
function getShortTimeString (date){
    var hour = date.getHours();
    hour = ("0" + hour).slice(-2);
    var min = date.getMinutes();
    min = ("0" + min).slice(-2);
    return hour + ":" + min;
    //return date.toLocaleTimeString('de',{ timeStyle: 'short', hour12: false });
  }

function getLongTimeString (date) {
    return date.toLocaleTimeString('de');
  }

load();
startTimers();
