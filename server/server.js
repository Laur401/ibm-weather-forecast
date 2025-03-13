const express = require ('express');
const cors = require('cors');
const redis = require('ioredis');
const app = express();
const redisClient = new redis();

app.use(cors());
app.use(express.json());
//redisClient.on('error', (err) => {console.log('Redis Error', err)});
//redisClient.connect();

app.get('/api/city', async (req, res) => {
    const city = req.query.city;

    const data = await fetchFromWeatherAPI(`https://api.meteo.lt/v1/places/${city}/forecasts/long-term`, `${city}CityCache`, 3600);
    res.status(200).json({temp: data.forecastTimestamps[0].airTemperature});
})
app.get('/api/places', async (req, res) => {
    const data = await fetchFromWeatherAPI("https://api.meteo.lt/v1/places", "placesCache", 86400);
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