import {Box, Grid2, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import {getFiveDayCityWeather, getMostViewedPlaces} from "./APIManager.js";


function FiveDayForecast({citySelection}) {

    const [fiveDayForecast, setFiveDayForecast] = useState([]);
    useEffect(() => {

        async function fetchFiveDayForecast(){
            if (citySelection.current===null) return;
            setFiveDayForecast(await getFiveDayCityWeather(citySelection.current));
        }
        fetchFiveDayForecast();
    }, [citySelection.current]);

    return (
        <div>
            Five day forecast:<br />
            <Grid2 container spacing={2} >
                {
                    fiveDayForecast.map((item)=>(
                        <Grid2>
                            {new Date(item.timestamp).toLocaleDateString()}<br />
                            {item.temperature}<br />
                            {item.precipitation}<br />
                            {item.weatherCondition}<br />
                        </Grid2>
                    ))
                }
            </Grid2>
        </div>
    );
}

export default FiveDayForecast;