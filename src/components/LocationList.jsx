import React from 'react'
const LocationList = ({locations, selectedLocationIds, setSelectedLocationIds}) => {
    const handleLocationChange = (location) => {
        setSelectedLocationIds((prevLocations) =>
            prevLocations.includes(location.id)
                ? prevLocations.filter((id) => id !== location.id)
                : [...prevLocations, location.id]
        );
    };
    
    const sortedLocations = [...locations].sort((a, b) => b.rating - a.rating);
    
    const getRowColor = (index) => {
        const thirdSize = Math.floor(sortedLocations.length / 3);
        if (index < thirdSize) {
        return 'yellow';
        } else if (index >= 2 * thirdSize) {
        return 'red';
        } else {
        return 'orange';
        }
    };

    return (
        <table className="table">
            <tbody>
                {sortedLocations.map((location, index) => (
                    <tr key={location.id}
                    style={{ backgroundColor: getRowColor(index) }}
                    >
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