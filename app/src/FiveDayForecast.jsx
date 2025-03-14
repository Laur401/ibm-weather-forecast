import {Stack} from "@mui/material";


function FiveDayForecast({fiveDayForecast}) {
    return (
        <>
            Five day forecast:<br />
            <Stack direction="row" spacing={2}>
                {
                    fiveDayForecast.map((item)=>(
                        <div>
                            {new Date(item.timestamp).toLocaleDateString()}<br />
                            {item.temperature}<br />
                            {item.precipitation}<br />
                            {item.weatherCondition}<br />
                        </div>
                    ))
                }
            </Stack>
        </>
    );
}

export default FiveDayForecast;