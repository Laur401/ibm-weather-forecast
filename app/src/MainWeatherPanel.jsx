import {getCityWeather, getLocationsList} from './APIManager.js'
import {useEffect, useRef, useState} from "react";
import {Autocomplete, MenuItem, NativeSelect, Select, TextField} from "@mui/material";
function MainWeatherPanel() {
    let [city, setCity] = useState(null);
    let citySelection = useRef(null);
    const [cityOptions, setCityOptions] = useState([]);

    const [temp, setTemp] = useState(null)
    async function handleSelection(event, newValue) {
        if (!newValue) return;
        setCity(newValue.label);
        citySelection.current = newValue.value;
        setTemp("...")
        console.log(citySelection.current);
        const t = await getCityWeather(citySelection.current.toLowerCase());
        console.log(t);
        setTemp(t)
    }
    useEffect( () => {
        async function fetchLocations(){
            setCityOptions(await getLocationsList());
        }
        fetchLocations();
    },[])

    return (
        <>
            <div>
                Hello! In {city}, it's:
                <h1>{temp}°C</h1>
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
            </div>
        </>
    )
}

export default MainWeatherPanel;