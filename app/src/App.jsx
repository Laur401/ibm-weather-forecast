import {useEffect, useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import MainWeatherPanel from "./MainWeatherPanel.jsx";
import FiveDayForecast from "./FiveDayForecast.jsx";
import MostViewedLocations from "./MostViewedLocations.jsx";
import {Autocomplete, Grid, Grid2, TextField} from "@mui/material";
import {getLocationsList, getMostViewedPlaces} from "./APIManager.js";

function App() {
    const [locationSelectionLabel, setLocationSelectionLabel] = useState(null);
    const locationSelectionValue = useRef(null);

    const [locationOptions, setLocationOptions] = useState([]);

    useEffect( () => {
        async function fetchLocations(){
            setLocationOptions(await getLocationsList());
        }
        fetchLocations();
    },[])


    function handleSelection(_, newValue) {
        if (newValue === null || newValue.value === locationSelectionValue.current) return;

        setLocationSelectionLabel(newValue.label);
        locationSelectionValue.current = newValue.value;
    }
    function handleButtonSelection(locationCode) {
        const location = locationOptions.find(option => option.code === locationCode);

        handleSelection(null, {label: location.name, value: location.code});
    }

  return (
      <>
          <Grid2 container spacing={2} >
              <Grid2 size={6} border={"2px solid white"}>
                  <MainWeatherPanel citySelection={locationSelectionValue} cityLabel={locationSelectionLabel} />
              </Grid2>
              <Grid2 size={12} border={"2px solid white"}>
                  <FiveDayForecast citySelection={locationSelectionValue} />
              </Grid2>
              <Grid2 size={6} border={"2px solid white"}>
                  <MostViewedLocations citySelection={locationSelectionValue} locationOptions={locationOptions} setSelectedLocation={(value)=>handleButtonSelection(value)} />
              </Grid2>

              <Grid2 size={6} border={"2px solid white"}>
                  <Autocomplete variant={"filled"} className={"dropdown"} onChange={handleSelection} options={
                      locationOptions.map((city, index, arr) => {
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
              </Grid2>

          </Grid2>
      </>
  )
}

export default App
