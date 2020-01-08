var stationBoardTable;

function load(){
    var stationName = getStation();
    var url = "https://timetable.search.ch/api/stationboard.json?stop="+stationName+"&show_delays=1&show_tracks=1&show_trackchanges=1&limit=50";
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
    setInterval(load, 60000);
}

function renderStaionboard(responseData) {
    renderStationBoardTitle(responseData.stop.name);
    renderStationboardTable(responseData.connections);
    renderUpdateTime();
}

function renderStationBoardTitle(stationName){
    document.getElementById("stationName").innerText = "Abfahrt " + stationName;
}

function renderTime(){
    var time = getLongTimeString(moment());
    document.getElementById("time").innerText = ""+time;
}

function renderUpdateTime(){
    var time = getShortTimeString(moment());
    document.getElementById("updateTime").innerText = "aktualisiert um "+time;
}

function renderStationboardTable(stationBoard){
    stationBoardTable = document.getElementById("stationboardBody");
    while (stationBoardTable.firstChild) {
        stationBoardTable.removeChild(stationBoardTable.firstChild);
      }
    stationBoard.forEach(renderJourney);
}

function renderJourney(journey) {
    var journeyRow = document.createElement("tr"); 

    var departureTime = document.createElement("td");
    //var time = getShortTimeString(new Date(journey.time));
    //2020-01-09 00:08:00
    var time = getShortTimeString(moment(journey.time, "YYYY-MM-DD hh:mm:ss"));
    var connection = getConnectionName(journey);
    departureTime.innerHTML = time + " " + connection;
    journeyRow.appendChild(departureTime);

    var destination = document.createElement("td");
    destination.innerText = journey.terminal.name;
    journeyRow.appendChild(destination);

    var platform = document.createElement("td");
    platform.innerHTML = getTrack(journey.track);
    journeyRow.appendChild(platform);

    var delay = document.createElement("td");
    delay.classList.add("information");
    delay.innerText = getDelay(journey.dep_delay);
    journeyRow.appendChild(delay);

    stationBoardTable.appendChild(journeyRow);
}

function getTrack(track) {
    if(track.slice(-1) === '!') return "<span class='trackChange'>"+track.slice(0,-1)+"</span>";
    else return track;
}

function getDelay(delay) {
    if(Number(delay)) return delay;
    return '';
}

function getConnectionName (connection) {
    var number = parseInt(connection["*L"]);
    number = isNaN(number) ? "" : number;
    var className = "connectionLogo " + connection["*G"];
    return "<div class='"+className+"'>"+connection["*G"] + number + "</div>";
}

function getStation() {
    try {
        var url = new URL(window.location.href);
        var station = url.searchParams.get("station");
        return station ? station : "Thalwil";
    } catch (e) {
        console.log(e);
    }
    return "Thalwil";
  }

  //utils
function getShortTimeString (date){
    return moment(date).format("HH:mm");

  }

function getLongTimeString (date) {
    return moment(date).format("HH:mm:ss");
  }
