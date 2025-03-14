import {getCityWeather, getLocationsList, getMostViewedPlaces} from './APIManager.js'
import {useEffect, useRef, useState} from "react";
import {Autocomplete, MenuItem, NativeSelect, Select, TextField} from "@mui/material";
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
    async function handleSelection(event, newValue) {
        if (!newValue) return;
        setCity(newValue.label);
        citySelection.current = newValue.value;
        setTemp("...")
        console.log(citySelection.current);
        const data = await getCityWeather(citySelection.current);
        console.log(data.temperature);
        setTemp(data.temperature);
        setWindSpeed(data.windSpeed);
        setHumidity(data.humidity);
        setPrecipitation(data.precipitation);
        setWeatherCond(data.weatherCondition);

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
                <Autocomplete variant={"filled"} onChange={handleSelection} options={
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
                              renderInput={(params) => <TextField {...params} label="Location" />}
                />
                Most-searched locations:<br />
                {
                    mostViewedPlaces.map((place)=> (
                        <>
                            {cityOptions.find((item) => item.code === place).name}<br />
                        </>
                    ))
                }
            </div>
        </>
    )
}

export default MainWeatherPanel;