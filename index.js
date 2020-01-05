var stationBoardTable;

function load(stationName){
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

function renderStaionboard(responseData) {
    var stationName = responseData.station.name;
    console.log("renderStaionboard" + stationName);
    var stationBoard = responseData.stationboard;
    renderStationboardTable(stationBoard);
}

function renderStationboardTable(stationBoard){
    stationBoardTable = document.createElement("tbody"); 
    stationBoard.forEach(renderJourney);
    var stationboardBody = document.getElementById("stationboardBody");
    var stationboard = document.getElementById("stationboard");
    stationboard.replaceChild(stationBoardTable,stationboardBody);
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
    const className = "connectionLogo " + connection.category;
    return "<div class='"+className+"'>"+connection.category + number + "</div>";
}

function getStation() {
    const url = new URL(window.location.href);
    const station = url.searchParams.get("station");
    return station ? station : "Thalwil";
  }

  //utils
function getShortTimeString (date){
    return date.toLocaleTimeString('de',{ timeStyle: 'short', hour12: false });
  }

function getLongTimeString (date) {
    return date.toLocaleTimeString('de');
  }

load("Thalwil");