import React from 'react'
import LocationCard from './LocationCard';
const LocationList = ({locations, allLocations, selectedLocationIds, setSelectedLocationIds, currentListPage, itemsPerPage}) => {
    const handleLocationChange = (location) => {
        setSelectedLocationIds((prevLocations) =>
            prevLocations.includes(location.id)
                ? prevLocations.filter((id) => id !== location.id)
                : [...prevLocations, location.id]
        );
    };
    
    const globalIndex = (index) => {
        return index + (currentListPage-1) * itemsPerPage;
    }

    const getRowColor = (index) => {
        const thirdSize = Math.floor(allLocations.length / 3);
        if (globalIndex(index) < thirdSize) {
        return 'yellow';
        } else if (globalIndex(index) >= 2 * thirdSize) {
        return 'red';
        } else {
        return 'orange';
        }
    };

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>Date Visited</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
                {locations.map((location, index) => (
                    <LocationCard
                        key={location.id}
                        location={location}
                        backgroundColor={getRowColor(index)}
                        handleLocationChange={handleLocationChange}
                        selectedLocationIds={selectedLocationIds}
                    />
                ))}
            </tbody>
        </table>
    );
}

export default LocationList;