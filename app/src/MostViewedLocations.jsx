function MostViewedLocations({mostViewedLocations, locationOptions, setSelectedLocation}) {
    return (
        <>
            Most-searched locations:<br />
            {
                mostViewedLocations.map(place => (
                    <>
                        <button onClick={()=>setSelectedLocation(place)}>{locationOptions.find(item => item.code === place).name}</button><br />
                    </>
                ))
            }
        </>
    );
}
export default MostViewedLocations;