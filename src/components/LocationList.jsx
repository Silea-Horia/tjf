import React from 'react'
const LocationList = ({locations, selectedLocationIds, setSelectedLocationIds}) => {
    const handleLocationChange = (location) => {
        setSelectedLocationIds((prevLocations) =>
            prevLocations.includes(location.id)
                ? prevLocations.filter((id) => id !== location.id)
                : [...prevLocations, location.id]
        );
    };

    return (
        <table className="table">
            <tbody>
                {locations.map((location) => (
                    <tr key={location.id}>
                        <td>
                            <input
                                type="checkbox"
                                onChange={() => handleLocationChange(location)}
                                checked={selectedLocationIds.includes(location.id)}
                            />
                        </td>
                        <td>{location.name}</td>
                        <td>{location.dateVisited}</td>
                        <td>{location.rating}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default LocationList;