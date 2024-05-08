let makeChart;
let currentViewData = "";
let chartLabel = "Datan nimi";
let currentSignal = "";
let chartCheck = false;
const view = document.getElementById('view').innerHTML;
const table = document.getElementById("dataTable");
let context;
let canvas;
let chartText;
if(view != 4){
    context = document.getElementById('chart-canvas').getContext("2d");
    canvas = document.getElementById('chart-canvas');
    chartText = document.getElementById("chart-text");
}

if(view == 1){
    timeSpan = "limit/50";
}
const showReadings = (readingsData) => {
    resetStats();
    currentViewData = "";
    if(view == 1){
        if(signalType == "" || timeSpan == "limit/50"){
            readingsData.map(item => {
                const row = document.createElement('tr');
                // Date
                createDate(item, row);
                // ---- Data ----
                createData(item, row);
                table.appendChild(row);
            })
            setTableTitle(timeSpan);
        }
        else if(signalType == "wind_speed/"){
            createWind(readingsData);
            setTableTitle(timeSpan);
        }
        else if(signalType == "temperature/"){
            createTemp(readingsData);
            setTableTitle(timeSpan);
        }
    }
    else if(view == 2){
        createWind(readingsData);
        setTableTitle(timeSpan);
    }
    else if(view == 3){
        createTemp(readingsData);
        setTableTitle(timeSpan);
    }
    else if(view == 4){
        readingsData.map(item => {
            const row = document.createElement('tr');
            // Date
            createDate(item, row);
            // ---- Data ----
            createData(item, row);
            table.appendChild(row);
        })
    }
}
const createTemp = (readingsData) => {
    //console.log("in createTemp")
    currentViewData = "lämpötila";
    if(view == 1){
        document.getElementById("th-data").innerHTML = "°C";
    }
    readingsData.map(item => {
        const row = document.createElement('tr');
        // Date
        createDate(item, row);
        // ---- Data ----
        createData(item, row);
        // Lisää rivin tauluun
        table.appendChild(row);
    })
    calculateStats(readingsData);
    buildChart(readingsData, view, context);
}
const createWind = (readingsData) => {
    if(view == 1){
        document.getElementById("th-data").innerHTML = "m/s";
    }
    currentViewData = "tuulen nopeus";
    readingsData.map(dataa => {
        const row = document.createElement('tr');
        // Date
        createDate(dataa, row);
        // ---- Data ----
        createData(dataa, row);
        // Lisää rivin tauluun
        table.appendChild(row);
    })
    calculateStats(readingsData);
    buildChart(readingsData, view, context);
}
const setTableTitle = (timeSpan) => {
    if(timeSpan == ""){
        document.getElementById("table-titleee").innerHTML = `Viimeiset 20 ${currentViewData} lukemaa:`;
        document.getElementById("dropdownMenuButton").innerHTML = "20 Lukemaa";
        chartText.style.display = "none";
    }
    else if(timeSpan == "24" || timeSpan == "48" || timeSpan == "72"){
        document.getElementById("table-titleee").innerHTML = `Viimeisen ${timeSpan} tunnin keskimääräinen ${currentViewData} tunnissa:`;
        chartText.style.display = "none";
    }
    else if(timeSpan == "1week"){
        document.getElementById("table-titleee").innerHTML = `Viimeisen viikon keskimääräinen ${currentViewData} tunnissa:`;
        chartText.style.display = "none";
    }
    else if(timeSpan == "1month"){
        document.getElementById("table-titleee").innerHTML = `Viimeisen kuukauden keskimääräinen ${currentViewData} tunnissa:`;
        chartText.style.display = "none";
    }
    else if(timeSpan == "limit/50"){
        canvas.style.display = "none";
        chartText.style.display = "block";
        document.getElementById("table-titleee").innerHTML = "Viimeiset 50 lukemaa:";
        document.getElementById("stat-h2").innerHTML = "";
        document.getElementById("stat").innerHTML = "Valitse signaali tilastoja varten";
        document.getElementById("explanation").innerHTML = "";
        document.getElementById("th-data").innerHTML = "Data";
        
    }
}


const switchTimeSpan = (wantedTimeSpan) => {
    if(view == 1){
        timeSpan = wantedTimeSpan;
  
        if(signalType == "" || timeSpan == "limit/50"){
            if(timeSpan != "limit/50"){
                document.getElementById("dropdownMenuButtoN").innerHTML = "Lämpötila";
                signalType = "temperature/";
                currentViewData = "lämpötila";
                clearTableAndChart();
                fetch50Readings(timeSpan, signalType);
            }
            else{
                document.getElementById("dropdownMenuButton").innerHTML = "Aikaväli";
                //console.log("signaltype: ",signalType, "timespan: " ,timeSpan)
                clearTableAndChart();
                fetch50Readings(timeSpan, signalType);
            }
        }
        else{
            //console.log("---SwitchTimeSpan else 1---")
            clearTableAndChart();
            fetch50Readings(timeSpan, signalType);
        }

    }
    // Sivu 2
    else if(view == 2){
        timeSpan = wantedTimeSpan;
        clearTableAndChart();
        fetchWindReadings(timeSpan);
    }
    // Sivu 3
    else if(view == 3){
        timeSpan = wantedTimeSpan;
        clearTableAndChart();
        fetchTempReadings(timeSpan);
    }
}
const clearTableAndChart = () => {
    if(chartCheck == true){
        makeChart.destroy();
    }
    var elmtTable = document.getElementById('dataTable');
    var tableRows = elmtTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;
    for (let x=rowCount-1; x>=0; x--) {
        elmtTable.removeChild(tableRows[x]);
    }
}
const createDate = (item, row) => {
   // ----- Päivämäärä -----
   const dataDate = document.createElement('td');
   dataDate.innerHTML = item.date_time.slice(0,10);
   row.appendChild(dataDate);
   // ---- Kellonaika ----
   const dataTime = document.createElement('td');
   dataTime.innerHTML = item.date_time.slice(11,16);
   row.appendChild(dataTime);
}
// Rakentaa datalle paikan ja asettaa sen tauluun
const createData = (item, row) => {
    if(timeSpan == "limit/50"){
        // ----- Data -----
        //console.log("-CreateData- if 1")
        const tData = document.createElement('td');
        tData.innerHTML = Object.keys(item.data)[0] + ": " + Object.values(item.data)[0];
        row.appendChild(tData);
    }
    else{
        if(timeSpan == ""){
            if(view == 4){
                const dataName = document.createElement('td');
                dataName.innerHTML = Object.keys(item)[2];
                row.appendChild(dataName);
            }
            //console.log("-CreateData- if else 1");
            const tData = document.createElement('td');
            // Hakee Datan arvon ja asettaa sen paikalleen
            tData.innerHTML = Object.values(item)[2].slice(0,5);
            // Lisää datan taulun riviin
            row.appendChild(tData);
        }
        else{
            //console.log("-CreateData- else 1");
            const tData = document.createElement('td');
            // Hakee Datan arvon ja asettaa sen paikalleen
            tData.innerHTML = Object.values(item)[1].slice(0,5);
            // Lisää datan taulun riviin
            row.appendChild(tData);
        }
    }
}
const buildChart = (data, view, context) =>{
    let chartData = [];
    canvas.style.display = "block";
    if(view == 1){
        if(signalType == "temperature/"){
            chartLabel = "Lämpötila °C";
        }
        else if(signalType == "wind_speed/"){
            chartLabel = "Tuulen nopeus m/s";
        }
    }
    if(view == 2){
        chartText.style.display = "none";
        chartLabel = "Tuulen nopeus m/s";
    }
    else if(view == 3){
        chartText.style.display = "none";
        chartLabel = "Lämpötila °C";
    }
    if(timeSpan == ""){
        chartData = Object.values(data).map(item => Object.values(item)[2]);
    }
    else{
        chartData = Object.values(data).map(item => Object.values(item)[1]);
    }
    
    const times = Object.values(data).map(item => Object.values(item)[0].slice(11,16));
    makeChart = new Chart(context, {
        type: "bar",
        data: {
            labels: times,
            datasets: [{
            label: chartLabel,
            backgroundColor: "#7a9eb1",
            borderRadius: 3,
            data: chartData
            }] 
        },
        options: {
            maintainAspectRatio: false
        }
    })
    chartCheck = true;
    
}

const showTimeSpan = (item) => {
    document.getElementById("dropdownMenuButton").innerHTML = item.innerHTML;
}
const showSignalType = (item) => {
    document.getElementById("dropdownMenuButtoN").innerHTML = item.innerHTML;
}
const showStat = (item) => {
    document.getElementById("dropDownMenuButton").innerHTML = item.innerHTML;
}
// Hakee viimeiset 50 lukemaa API:sta
const fetch50Readings = async(funcTimeSpan) => {
    try {
        const response = await fetch(`https://webapi19sa-1.course.tamk.cloud/v1/weather/${signalType}${funcTimeSpan}`);
        const data = await response.json();
        showReadings(data);
    } catch (error) {
        console.log(error);
    }
}
// Hakee 20 tuulennopeus lukemaa API:sta
const fetchWindReadings = async(funcTimeSpan) => {
    try {
        const response = await fetch(`https://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed/${signalType}${funcTimeSpan}`);
        const data = await response.json();
        //console.log("Script.js...:");
        console.log(data);
        showReadings(data);
    } catch (error) {
        console.log(error);
    }
}
// Hakee 20 lämpötila lukemaa API:sta

const fetchTempReadings = async(funcTimeSpan) => {
    try {
        const response = await fetch(`https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/${signalType}${funcTimeSpan}`);
        const data = await response.json();
        //console.log("Script.js...:");
        console.log(data);
        showReadings(data);
    } catch (error) {
        console.log(error);
    }
}
const fetchKarsimysReadings = async() => {
    try {
        const response = await fetch(`https://webapi19sa-1.course.tamk.cloud/v1/weather/Karsimys`);
        const data = await response.json();
        //console.log("Script.js...:");
        console.log(data);
        showReadings(data);
    } catch (error) {
        console.log(error);
    }
}



// Hakee tiedot API:sta riippuen millä sivulla käyttäjä on
// Sivu 1
if(view == 1){
    fetch50Readings(timeSpan);
}
// Sivu 2
else if(view == 2){
    fetchWindReadings(timeSpan);
}
// Sivu 3
else if(view == 3){
    fetchTempReadings(timeSpan);
}
else if(view == 4){
    fetchKarsimysReadings();
}
