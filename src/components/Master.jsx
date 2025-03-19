import React from 'react'
import LocationList from './LocationList'

const Master = ({serv, setData, setNewLocation, searchTerm, selectedRatings, selectedLocationIds, setSelectedLocationIds, setCurrentPage}) => {
    const removeElements = () => {
        selectedLocationIds.forEach(locationId => {
          serv.delete(locationId);
        });
        setData(serv.getAll());
        setSelectedLocationIds([]);
    };

    const handleUpdateClick = () => {
        if (selectedLocationIds.length === 1) {
            setNewLocation(data.filter(location => location.id === selectedLocationIds[0])[0]);
        }
        setCurrentPage('update');
    };

    return (
        <div className="main-content">
            <LocationList 
                locations={serv.filter(searchTerm, selectedRatings)} 
                selectedLocationIds={selectedLocationIds} 
                setSelectedLocationIds={setSelectedLocationIds}
            />
            <button type="button" onClick={() => setCurrentPage('add')}>Add</button>
            <button type="button" onClick={removeElements}>Remove</button>
            <button type="button" onClick={() => handleUpdateClick()}>Update</button>
        </div>
    )
}

export default Master