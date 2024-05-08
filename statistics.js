let avg = 0;
let med = 0;
let mode = 0;
let range = 0;
let sd = 0;
let dataType = "";
let timeSpan = "";
let signalType = "";
let sortedValues = [];
let dataValues = [];
let valuess = [];
const calculateStats = (itemData) => {
    const view = document.getElementById('view').innerHTML;
    // -------- Tuulen nopeus -------- 
    resetStats();
    if(view == 1){
        if(signalType == "wind_speed/"){
            createWindStats(itemData);
        }
        else if(signalType == "temperature/"){
            createTempStats(itemData);
        }
    }
    else if(view == 2){
        createWindStats(itemData);
    }
    // -------- Lämpötila -------- 
    else if(view == 3){
        createTempStats(itemData);
    }
    else{
        console.log(error)
    }
    // Keskiarvon laskeminen
    avg = calculateAverage(valuess);
    // Mediaanin laskeminen
    med = calculateMedian(valuess);
    // Moodin laskeminen
    mode = calculateMode(sortedValues);
    // Vaihteluvälin laskeminen
    range = calculateRange(valuess);
    // Keskihajonnan laskeminen
    sd = calculateSD();
    switchStat();
    /*
    console.log(valuess)
    console.log(`${dataType} Keskiarvo:`, avg);
    console.log(`${dataType} Mediaani:`, med);
    console.log(`${dataType} Moodi:`, mode);
    console.log(`${dataType} Vaihteluväli:`, range);
    console.log(`${dataType} Keskihajonta:`, sd)
    */
}
const resetStats = () => {
    valuess = [];
    dataValues = [];
    sortedValues = [];
    avg = 0;
    med = 0;
    mode = 0;
    range = 0;
    sd = 0;
    dataType = "";
}
const createTempStats = (itemData) =>{
    itemData.map(item => {
        if(timeSpan == ""){
            // Tehdään lista lämpötilaluvuista
            const dataValue = Object.values(item)[2].slice(0,5);
            dataValues.push(dataValue);
        }
        else{
            const dataValue = Object.values(item)[1].slice(0,5);
            dataValues.push(dataValue);
        }
    });
    valuess = dataValues;
    dataType = "Lämpötilan";
}
const createWindStats = (itemData) => {
    itemData.map(item => {
        if(timeSpan == ""){
            // Tehdään lista lämpötilaluvuista
            const dataValue = Object.values(item)[2].slice(0,5);
            dataValues.push(dataValue);
        }
        else{
            const dataValue = Object.values(item)[1].slice(0,5);
            dataValues.push(dataValue);
        }
    });
    valuess = dataValues;
    dataType = "Tuulen nopeuden";
}
const getSignalType = (wantedSignal) => {
    signalType = wantedSignal;
}
// Keskiarvo
const calculateAverage = (valuesArray) => {
    let sum = 0;
    let calAvg = 0
    // Listan numeroiden yhteenlasku:
    for(let i = 0; valuesArray.length > i; i++){
        sum = sum + parseFloat(valuesArray[i]);
    }
    // Lasketaan keskiarvo:
    calAvg = sum / valuesArray.length;
    calAvg = calAvg.toFixed(2); // Keskiarvo 2 desimaalin tarkkuudella
    return calAvg; // Palautetaan keskiarvo
}
// Mediaani
const calculateMedian = (valuesArray) => {
    let calMed = 0;
    let arrayLength
    let medIndex
    sortedValues = [];
    // Mediaanin laskeminen
    sortedValues = valuesArray.sort(compareNumbers); // Järjestetään lista pienimmästä luvusta suurimpaan
    // Järjestetyn listan mediaani
    arrayLength = valuesArray.length;
    medIndex = Math.round(arrayLength /2);
    calMed = sortedValues[medIndex];
    return calMed; // Palautetaan Mediaani
};
function compareNumbers(a,b){
    return a-b;
};
// Moodi
const calculateMode = (a) => {
    let bestStreak = 1;
    let bestNumber = a[0];
    let currentStreak = 1;
    let currentNumber = a[0];
    let calMode = 0;
    for(let i = 1; i < a.length; i++){
        if(a[i-1] !== a[i]){
            if(currentStreak > bestStreak){
                bestStreak = currentStreak;
                bestNumber = currentNumber;
            };
          currentStreak = 0;
          currentNumber = a[i];
        };
        currentStreak++;
    };
    calMode = currentStreak > bestStreak ? currentNumber : bestNumber;
    return calMode;
};
// Vaihteluväli
const calculateRange = (valuesArray) => {
    let lowestValue = sortedValues[0];
    let arrayLength = valuesArray.length - 1;
    let highestValue = sortedValues[arrayLength];
    let calRange = highestValue - lowestValue;
    calRange = calRange.toFixed(2);
    return calRange;
};
// Keskihajonta
const calculateSD = () => {
let calSd = 0;
for(let i in sortedValues) 
    calSd += Math.pow((parseFloat(sortedValues[i]) - avg),2);
    let sdResult = Math.sqrt(calSd/(sortedValues.length-1));
    sdResult = sdResult.toFixed(2);
    return sdResult;
};

const switchStat = (wichStat) => {
    document.getElementById("stat-h2").innerHTML = `${dataType} Keskiarvo:`
    document.getElementById("stat").innerHTML = avg;
    document.getElementById("explanation").innerHTML = "Keskiarvo on lukujen summa jaettuna niiden lukumäärällä.";
    if(wichStat == 1){
        document.getElementById("stat-h2").innerHTML = `${dataType} Keskiarvo:`
        document.getElementById("stat").innerHTML = avg;
        document.getElementById("explanation").innerHTML = "Keskiarvo on lukujen summa jaettuna niiden lukumäärällä.";
    }
    else if(wichStat == 2){
        document.getElementById("stat-h2").innerHTML = `${dataType} Mediaani:`
        document.getElementById("stat").innerHTML = med;
        document.getElementById("explanation").innerHTML = "Mediaani on suuruuskoossa järjestetyn joukon keskimmäinen alkio.";
    }
    else if(wichStat == 3){
        document.getElementById("stat-h2").innerHTML = `${dataType} Moodi:`
        document.getElementById("stat").innerHTML = mode;
        document.getElementById("explanation").innerHTML = "Moodi eli tyyppiarvo on havaintoaineiston useimmin esiintyvä arvo."
    }
    else if(wichStat == 4){
        document.getElementById("stat-h2").innerHTML = `${dataType} Vaihteluväli:`
        document.getElementById("stat").innerHTML = range;
        document.getElementById("explanation").innerHTML = "Vaihteluväli on muuttujan suurimman ja pienimmän arvon välimatka."
    }
    else if(wichStat == 5){
        document.getElementById("stat-h2").innerHTML = `${dataType} Keskihajonta:`
        document.getElementById("stat").innerHTML = sd;
        document.getElementById("explanation").innerHTML = "Keskihajonta on hajontaluku, joka kuvaa keskimääräistä poikkeamaa odotusarvosta."
    }
}