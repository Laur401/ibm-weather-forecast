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
            <Box style={{fontSize: "1.2rem"}} marginBottom={"0.6rem"}>Five day forecast:</Box>
            <Grid2 container spacing={"1rem"} justifyContent={"space-evenly"} textAlign={"center"}>
                {
                    fiveDayForecast.map((item)=>(
                        <Grid2>
                            <Box style={{fontSize: "1rem"}} marginBottom={"0.6rem"} className={"subText"}>{new Date(item.timestamp).toLocaleDateString()}</Box>
                            <Box>{item.temperature}°C</Box>
                            <Box>{item.weatherCondition}</Box>
                            <Box>{item.precipitation}%</Box>
                        </Grid2>
                    ))
                }
            </Grid2>
        </div>
    );
}

export default FiveDayForecast;