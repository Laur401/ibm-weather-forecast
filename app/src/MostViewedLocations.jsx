import {useEffect, useState} from "react";
import {getMostViewedPlaces} from "./APIManager.js";
import {Box, Grid2, Link} from "@mui/material";

function MostViewedLocations({mutableDependency, locationOptions, setSelectedLocation}) {
    const [mostViewedLocations, setMostViewedLocations] = useState([]);

    useEffect( () => {
        async function fetchMostViewedLocations() {
            let fetchedData = await getMostViewedPlaces();
            const data = [];
            for (let i = 0; i < 3; i++) {
                if (Object.values(fetchedData)[i] > 0) {
                    data.push(Object.keys(fetchedData)[i]);
                }
            }
            setMostViewedLocations(data);
        }
        fetchMostViewedLocations();
    }, [mutableDependency])

    return (
        <div>
            <Box fontSize={"1.2rem"} marginBottom={"0.6rem"}>Most-searched locations:</Box>
            {mostViewedLocations.length > 0
            ? <Grid2 container spacing={2} width={"100%"}>
                    {
                        mostViewedLocations.map(place => (
                            <Grid2>
                                {locationOptions.length > 0 &&
                                    <Link component={"button"} onClick={() => setSelectedLocation(place)}>
                                        {locationOptions.find(item => item.code === place).name}
                                    </Link>}
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