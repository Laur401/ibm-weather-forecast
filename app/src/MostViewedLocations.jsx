import {useEffect, useState} from "react";
import {getMostViewedPlaces} from "./APIManager.js";
import {Grid2} from "@mui/material";

function MostViewedLocations({citySelection, locationOptions, setSelectedLocation}) {
    const [mostViewedLocations, setMostViewedLocations] = useState([]);

    useEffect( () => {
        async function fetchMostViewedLocations() {
            setMostViewedLocations(await getMostViewedPlaces());
        }
        fetchMostViewedLocations();
    },[citySelection.current])

    return (
        <div>
            Most-searched locations:<br />
            <Grid2 container  width={"100%"}>
                {
                    mostViewedLocations.map(place => (
                        <Grid2>
                            {locationOptions.length > 0 && <button
                                onClick={() => setSelectedLocation(place)}>{locationOptions.find(item => item.code === place).name}</button>}<br />
                        </Grid2>
                    ))
                }
            </Grid2>

        </div>
    );
}
export default MostViewedLocations;