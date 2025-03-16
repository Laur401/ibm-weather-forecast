const express = require('express');
const cors = require('cors');
const redis = require('redis');
const requestIp = require('request-ip');
const dateFns = require('date-fns');
const app = express();
const redisClient = redis.createClient();
let isRedisAvailable = true;

const placeViewCounter = {};

async function setup() {
    await redisClient.connect().catch((err) => {
        console.error("Redis client unavailable. " + err);
        isRedisAvailable = false;
    })

    // Setup for the most popular places counter
    fetchFromWeatherAPI("https://api.meteo.lt/v1/places", "placesCache", 86400)
        .then(places => {
            for (const place of places) {
                placeViewCounter[place.code] = 0;
            }
        });
}
setup();

app.use(cors());
app.use(express.json());

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

// Weather forecast for a specified location.
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

// Five-day weather forecast for a specified location.
app.get('/api/city/five_day_forecast', async (req, res) => {
    const city = req.query.city;

    const data = await fetchFromWeatherAPI(`https://api.meteo.lt/v1/places/${city}/forecasts/long-term`, `${city}CityCache`, 3600);

    const requestDate = new Date(Date.now());
    const returnData = [];

    for (let i = 1; i<=5; i++){
        const futureDate = dateFns.addDays(requestDate, i);
        let index = data.forecastTimestamps.findIndex(item => new Date(item.forecastTimeUtc) >= futureDate);
        while (new Date(data.forecastTimestamps[index].forecastTimeUtc).getDate() !== futureDate.getDate()) //Making sure to always get the correct date
            index--;
        returnData.push({
            timestamp: data.forecastTimestamps[index].forecastTimeUtc,
            temperature: data.forecastTimestamps[index].airTemperature,
            windSpeed: data.forecastTimestamps[index].windSpeed,
            humidity: data.forecastTimestamps[index].relativeHumidity,
            precipitation: data.forecastTimestamps[index].totalPrecipitation,
            weatherCondition: weatherOptions[data.forecastTimestamps[index].conditionCode],
        })
    }
    res.status(200).json(returnData);
})

// List of all locations available to retrieve weather data for.
app.get('/api/places', async (req, res) => {
    const data = await fetchFromWeatherAPI("https://api.meteo.lt/v1/places", "placesCache", 86400);
    res.status(200).json(data);
})

// List of locations sorted by search count.
app.get('/api/most_viewed_places', async (req, res) => {
    const sortedPlaceViewCounter = Object.fromEntries(
        Object.entries(placeViewCounter).sort(([, a], [, b])=>b-a)
    );
    res.status(200).json(sortedPlaceViewCounter);
})

app.listen(3000, () => {
    console.log('App is running on port 3000');
})

// Fetcher function that gets data from a Redis cache if it exists, and if not fetches the weather data and stores it in the cache.
async function fetchFromWeatherAPI(url, cacheKey, cacheDuration) {
    if (isRedisAvailable) {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData)
            return JSON.parse(cachedData);
    }
    let data = await fetch(url);
    data = await data.json();
    if (isRedisAvailable)
        await redisClient.set(cacheKey, JSON.stringify(data), "EX", cacheDuration);
    return data;
}