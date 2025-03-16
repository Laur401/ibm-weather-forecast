import {Box, Grid2} from "@mui/material";
import {useEffect, useState} from "react";
import {getFiveDayCityWeather} from "./APIManager.js";


function FiveDayForecast({mutableDependency, citySelection}) {

    const [fiveDayForecast, setFiveDayForecast] = useState([]);
    useEffect(() => {

        async function fetchFiveDayForecast(){
            if (citySelection.current===null) return;
            setFiveDayForecast(await getFiveDayCityWeather(citySelection.current));
        }
        fetchFiveDayForecast();
    }, [mutableDependency]);

    return (
        <div>
            <Box style={{fontSize: "1.2rem"}} marginBottom={"0.6rem"}>Five day forecast:</Box>
            <Grid2 container spacing={"1rem"} justifyContent={"space-evenly"} textAlign={"center"}>
                {
                    fiveDayForecast.map((item)=>(
                        <Grid2 key={item.timestamp}>
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