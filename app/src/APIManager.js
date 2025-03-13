function GetWeatherAPI(){
    fetch("https://api.meteo.lt/v1/places")
    .then(res => res.json())
}

export async function getCityWeather(city){

    const response = await fetch(`http://localhost:3000/api/city?city=${city}`);
    if (!response.ok)
        throw new Error(response.statusText);
    const data = await response.json();
    return data.temp
}

export async function getLocationsList(){
    const response = await fetch("http://localhost:3000/api/places");
    if (!response.ok)
        throw new Error(response.statusText);
    const data = await response.json();
    return data;
}