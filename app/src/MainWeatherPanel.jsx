import {getCityWeather, getFiveDayCityWeather, getLocationsList, getMostViewedPlaces} from './APIManager.js'
import {useEffect, useRef, useState} from "react";
import {Autocomplete, Box, Grid2, MenuItem, NativeSelect, Select, Stack, TextField} from "@mui/material";
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
            <Stack direction="column" alignItems="center" size={"auto"}>
                <Box textAlign={"center"} style={{fontSize: "1.5rem"}} marginBottom={3}>{cityLabel}</Box>
                <Box style={{fontSize: "3rem", fontWeight: "bold"}}>{temp}°C</Box>
                <Box marginBottom={5}>{weatherCond}</Box>
                <Grid2 container spacing={"0.5rem"} width={"100%"}>
                    <Grid2 size={6}>
                        <Stack direction={"column"} textAlign={"right"} spacing={"0.25rem"} className={"subText"}>
                            <Box>Humidity:</Box>
                            <Box>Precipitation:</Box>
                            <Box whiteSpace={"nowrap"}>Wind speed:</Box>
                        </Stack>
                    </Grid2>
                    <Grid2 size={6}>
                        <Stack direction={"column"} textAlign={"left"} spacing={"0.25rem"}>
                            <Box>{humidity}%</Box>
                            <Box>{precipitation} mm</Box>
                            <Box>{windSpeed} m/s</Box>
                        </Stack>
                    </Grid2>
                </Grid2>
            </Stack>
        </div>
    )
}

export default MainWeatherPanel;