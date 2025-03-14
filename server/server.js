const express = require ('express');
const cors = require('cors');
const redis = require('ioredis');
const requestIp = require('request-ip');
const app = express();
const redisClient = new redis();

app.use(cors());
app.use(express.json());
//redisClient.on('error', (err) => {console.log('Redis Error', err)});
//redisClient.connect();

const weatherOptions = {
    "clear": "Clear",
    "partly-cloudy": "Partly Cloudy",
    "cloudy-with-sunny-intervals": "Cloudy with Sunny intervals",
    "cloudy": "Cloudy",
    "light-rain": "Light Rain",
    "rain": "Rain",
    "heavy-rain": "Heavy Rain",
    "thunder": "Thunder",
    "isolated-thunderstorms": "Isolated Thunderstorms",
    "thunderstorms": "Thunderstorms",
    "heavy-rain-with-thunderstorms": "Heavy Rain with Thunderstorms",
    "light-sleet": "Light Sleet",
    "sleet": "Sleet",
    "freezing-rain": "Freezing Rain",
    "hail": "Hail",
    "light-snow": "Light Snow",
    "snow": "Snow",
    "heavy-snow": "Heavy Snow",
    "fog": "Fog",
    "null": "Unknown"
}

const placeViewCounter = {};
fetchFromWeatherAPI("https://api.meteo.lt/v1/places", "placesCache", 86400)
    .then(places => {
        for (const place of places) {
            placeViewCounter[place.code] = 0;
        }
    });


app.get('/api/city', async (req, res) => {
    const city = req.query.city;

    const data = await fetchFromWeatherAPI(`https://api.meteo.lt/v1/places/${city}/forecasts/long-term`, `${city}CityCache`, 3600);
    placeViewCounter[city]++;
    const requestDate = new Date(Date.now()).toISOString();
    console.log(`${requestIp.getClientIp(req)} fetched data for location ${city} at ${requestDate}`);
    res.status(200).json({
        temperature: data.forecastTimestamps[0].airTemperature,
        windSpeed: data.forecastTimestamps[0].windSpeed,
        humidity: data.forecastTimestamps[0].relativeHumidity,
        precipitation: data.forecastTimestamps[0].totalPrecipitation,
        weatherCondition: weatherOptions[data.forecastTimestamps[0].conditionCode],
    });
})
app.get('/api/places', async (req, res) => {
    const data = await fetchFromWeatherAPI("https://api.meteo.lt/v1/places", "placesCache", 86400);
    res.status(200).json(data);
})

app.get('/api/most_viewed_places', async (req, res) => {
    const sortedPlaceViewCounter = Object.entries(placeViewCounter).sort(([, a], [, b])=>b-a);
    const data = [];
    for (let i = 0; i < 3; i++) {
        if (sortedPlaceViewCounter[i][1] > 0) {
            data.push(sortedPlaceViewCounter[i][0]);
        }
    }
    res.status(200).json(data);
})

app.listen(3000, () => {
    console.log('App is running on port 3000');
})

async function fetchFromWeatherAPI(url, cacheKey, cacheDuration) {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData)
        return JSON.parse(cachedData);
    let data = await fetch(url);
    data = await data.json();
    redisClient.set(cacheKey, JSON.stringify(data), "EX", cacheDuration);
    return data;
}