import configVars from "./vars.config.js";

// Functions for fetching from the backend API.

export async function getCityWeather(city){
    return await getAPIData(`${configVars.serverURL}/city?city=${city}`);
}

export async function getFiveDayCityWeather(city){
    return await getAPIData(`${configVars.serverURL}/city/five_day_forecast?city=${city}`);
}

export async function getLocationsList(){
    return await getAPIData(`${configVars.serverURL}/places`);
}

export async function getMostViewedPlaces(){
    return await getAPIData(`${configVars.serverURL}/most_viewed_places`);
}

async function getAPIData(URL){
    const response = await fetch(URL);
    if (!response.ok)
        throw new Error(response.statusText);
    return await response.json();
}