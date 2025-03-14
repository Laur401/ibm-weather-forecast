function GetWeatherAPI(){
    fetch("https://api.meteo.lt/v1/places")
    .then(res => res.json())
}

export async function getCityWeather(city){

    const response = await fetch(`http://localhost:3000/api/city?city=${city}`);
    if (!response.ok)
        throw new Error(response.statusText);
    return await response.json();
}

export async function getLocationsList(){
    const response = await fetch("http://localhost:3000/api/places");
    if (!response.ok)
        throw new Error(response.statusText);
    return await response.json();
}

export async function getMostViewedPlaces(){
    const response = await fetch("http://localhost:3000/api/most_viewed_places");
    if (!response.ok)
        throw new Error(response.statusText);
    return await response.json();
}