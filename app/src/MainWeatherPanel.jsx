import {getCityWeather, getFiveDayCityWeather, getLocationsList, getMostViewedPlaces} from './APIManager.js'
import {useEffect, useRef, useState} from "react";
import {Autocomplete, Box, Grid2, MenuItem, NativeSelect, Select, Stack, TextField} from "@mui/material";
import "./MainWeatherPanel.scss";
import FiveDayForecast from "./FiveDayForecast.jsx";
import MostViewedLocations from "./MostViewedLocations.jsx";
function MainWeatherPanel({citySelection, cityLabel}) {
    const [temp, setTemp] = useState(null);
    const [windSpeed, setWindSpeed] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [precipitation, setPrecipitation] = useState(null);
    const [weatherCond, setWeatherCond] = useState(null);
    useEffect(() => {
        async function updateData(){
            if (citySelection.current===null) return;
            setTemp("...");
            const data = await getCityWeather(citySelection.current);
            console.log(data.temperature);

            setTemp(data.temperature);
            setWindSpeed(data.windSpeed);
            setHumidity(data.humidity);
            setPrecipitation(data.precipitation);
            setWeatherCond(data.weatherCondition);
        }
        console.log(citySelection)
        updateData();
    }, [citySelection.current]);

    return (
        <div>
            <Grid2 container direction="column" alignItems="center" size={"auto"}>
                <Grid2 marginBottom={3}>
                    <Box textAlign={"center"} style={{fontSize: 24}}>{cityLabel}</Box>
                </Grid2>
                <Grid2 textAlign={"center"} marginBottom={5}>
                    <Box style={{fontSize: 36, fontWeight: "bold"}}>{temp}°C</Box>
                    {weatherCond}<br/>
                </Grid2>

                <Grid2>
                    Humidity: {humidity}%<br/>
                    Precipitation: {precipitation} mm.<br/>
                    Wind speed: {windSpeed} m/s<br/>
                </Grid2>
            </Grid2>
        </div>
    )
}

export default MainWeatherPanel;