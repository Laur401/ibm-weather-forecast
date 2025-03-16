import {useEffect, useRef, useState} from 'react'
import './App.scss'
import MainWeatherPanel from "./MainWeatherPanel.jsx";
import FiveDayForecast from "./FiveDayForecast.jsx";
import MostViewedLocations from "./MostViewedLocations.jsx";
import {Autocomplete, Box, Divider, Grid, Grid2, IconButton, Link, Stack, TextField} from "@mui/material";
import {getLocationsList} from "./APIManager.js";
import {LightModeTwoTone} from "@mui/icons-material";

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

    function themeChange(){
        const propertyChange = (prop, value) => document.documentElement.style.setProperty(prop, value);

        const theme = document.documentElement.style.getPropertyValue("--theme");
        if (theme=="dark"){
            propertyChange("--theme", "light");
            propertyChange("--theme-color", "rgba(0, 0, 0, 0.87)");
            propertyChange("--theme-background-color", "rgba(229, 229, 229, 1)");
            propertyChange("--theme-border", "rgba(0, 0, 0, 0.12) 1px solid");
            propertyChange("--theme-subtext-color", "rgba(0, 0, 0, 0.50)");
            propertyChange("--theme-panel-background-color", "rgba(255, 255, 255, 0.31)");
            propertyChange("--theme-divider-border-color", "rgba(0, 0, 0, 0.12)");
        }
        else {
            propertyChange("--theme", "dark");
            propertyChange("--theme-color", "rgba(255, 255, 255, 0.87)");
            propertyChange("--theme-background-color", "rgba(26, 26, 26, 1)");
            propertyChange("--theme-border", "rgba(255, 255, 255, 0.12) 1px solid");
            propertyChange("--theme-subtext-color", "rgba(255, 255, 255, 0.50)");
            propertyChange("--theme-panel-background-color", "rgba(0, 0, 0, 0.19)");
            propertyChange("--theme-divider-border-color", "rgba(255, 255, 255, 0.12)");
        }
    }

  return (
      <>
          <header className="App-header">
              <Grid2 container direction={"row"} alignItems={"center"} spacing={"1rem"}>
                  <Grid2 size={"grow"}>
                      <Box justifySelf={"left"} fontSize={"1.25rem"}>Weather-o-rama</Box>
                  </Grid2>
                  <Grid2 size={"auto"}>
                      <Link justifySelf={"end"} href={"https://github.com/Laur401/ibm-weather-forecast"}>GitHub</Link>
                  </Grid2>
                  <Grid2 size={"auto"}>
                      <IconButton onClick={themeChange}>
                        <LightModeTwoTone className={"colorModeIcon"} />
                      </IconButton>
                  </Grid2>
              </Grid2>
          </header>
          <Grid2 container spacing={2} columns={{xs: 6, md: 12}}>
              <Grid2 size={6}>
                  <Box className={"container"}>
                      {locationSelectionLabel
                          ? <>
                              <MainWeatherPanel citySelection={locationSelectionValue} cityLabel={locationSelectionLabel} />
                              <Divider className={"divider"}/>
                              <FiveDayForecast citySelection={locationSelectionValue} />
                          </>
                          : <>
                              Select a location!
                          </>
                      }
                      {}
                  </Box>
              </Grid2>
              <Grid2 size={6}>
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
                  <Box className={"divider"}/>
                  <MostViewedLocations citySelection={locationSelectionValue} locationOptions={locationOptions} setSelectedLocation={(value)=>handleButtonSelection(value)} />
              </Grid2>
          </Grid2>
      </>
  )
}

export default App
