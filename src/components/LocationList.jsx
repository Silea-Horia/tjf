import React from 'react'

const handleLocationChange = (location, setSelectedLocationIds) => {
    setSelectedLocationIds((prevLocations) =>
        prevLocations.includes(location.id)
            ? prevLocations.filter((id) => id !== location.id)
            : [...prevLocations, location.id]
    );
};

const LocationList = ({locations, selectedLocationIds, setSelectedLocationIds}) => {
    return (
        <table className="table">
            <tbody>
                {locations.map((location) => (
                    <tr key={location.id}>
                        <td>
                            <input
                                type="checkbox"
                                onChange={() => handleLocationChange(location, setSelectedLocationIds)}
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