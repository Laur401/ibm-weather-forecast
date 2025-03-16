import {useEffect, useState} from "react";
import {getMostViewedPlaces} from "./APIManager.js";
import {Box, Grid2, Link} from "@mui/material";

function MostViewedLocations({citySelection, locationOptions, setSelectedLocation}) {
    const [mostViewedLocations, setMostViewedLocations] = useState([]);

    useEffect( () => {
        async function fetchMostViewedLocations() {
            setMostViewedLocations(await getMostViewedPlaces());
        }
        fetchMostViewedLocations();
    },[])

    return (
        <div>
            <Box fontSize={"1.2rem"} marginBottom={"0.6rem"}>Most-searched locations:</Box>
            {mostViewedLocations.length > 0
            ? <Grid2 container spacing={2} width={"100%"}>
                    {
                        mostViewedLocations.map(place => (
                            <Grid2>
                                {locationOptions.length > 0 && <Link component={"button"}
                                                                     onClick={() => setSelectedLocation(place)}>{locationOptions.find(item => item.code === place).name}</Link>}<br />
                            </Grid2>
                        ))
                    }
                </Grid2>
            : <>None yet!</>
            }


        </div>
    );
}
export default MostViewedLocations;