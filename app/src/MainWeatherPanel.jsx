import {getCityWeather, getFiveDayCityWeather, getLocationsList, getMostViewedPlaces} from './APIManager.js'
import {useEffect, useRef, useState} from "react";
import {Autocomplete, MenuItem, NativeSelect, Select, Stack, TextField} from "@mui/material";
import "./MainWeatherPanel.scss";
import FiveDayForecast from "./FiveDayForecast.jsx";
import MostViewedLocations from "./MostViewedLocations.jsx";
function MainWeatherPanel() {
    let [city, setCity] = useState(null);
    let citySelection = useRef(null);

    const [cityOptions, setCityOptions] = useState([]);

    const [temp, setTemp] = useState(null);
    const [windSpeed, setWindSpeed] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [precipitation, setPrecipitation] = useState(null);
    const [weatherCond, setWeatherCond] = useState(null);

    const [mostViewedPlaces, setMostViewedPlaces] = useState([]);
    const [fiveDayForecast, setFiveDayForecast] = useState([]);
    function handleSelection(_, newValue) {
        if (newValue.value === citySelection.current) return;
        console.log(newValue);

        setCity(newValue.label);
        citySelection.current = newValue.value;
        console.log(citySelection.current);

        updateData();
    }
    function handleButtonSelection(locationCode) {
        const location = cityOptions.find(option => option.code === locationCode);

        handleSelection(null, {label: location.name, value: location.code});
    }

    async function updateData(){
        setTemp("...");
        const data = await getCityWeather(citySelection.current);
        console.log(data.temperature);

        setTemp(data.temperature);
        setWindSpeed(data.windSpeed);
        setHumidity(data.humidity);
        setPrecipitation(data.precipitation);
        setWeatherCond(data.weatherCondition);

        setFiveDayForecast(await getFiveDayCityWeather(citySelection.current));

        const mostViewedPlaces = await getMostViewedPlaces();
        setMostViewedPlaces(mostViewedPlaces);
    }
    useEffect( () => {
        async function fetchLocations(){
            setCityOptions(await getLocationsList());
            setMostViewedPlaces(await getMostViewedPlaces());
        }
        fetchLocations();
    },[])

    return (
        <>
            <div>
                Hello! In {city}, it's:
                <h1>{temp}°C</h1>
                {weatherCond}<br/>
                Humidity: {humidity}%<br/>
                Precipitation: {precipitation} mm.<br/>
                Wind speed: {windSpeed} m/s<br/>
                <Autocomplete variant={"filled"} className={"dropdown"} onChange={handleSelection} options={
                    cityOptions.map((city, index, arr) => {
                        const count = arr.slice(0, index)
                            .filter((item) => item.name === city.name)
                            .length;
                        if (count>0) {
                            return {label: `${city.name} ${count}`, value: city.code}
                        }
                        else {
                            return {label: city.name, value: city.code}
                        }
                    })
                }
                              renderInput={(params) => <TextField {...params} variant={"standard"} label="Location" />}
                />
                <FiveDayForecast fiveDayForecast={fiveDayForecast} />
                <MostViewedLocations mostViewedLocations={mostViewedPlaces} locationOptions={cityOptions} setSelectedLocation={(value)=>handleButtonSelection(value)} />
            </div>
        </>
    )
}

export default MainWeatherPanel;