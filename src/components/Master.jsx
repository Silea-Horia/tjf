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
            setNewLocation(serv.getAll().filter(location => location.id === selectedLocationIds[0])[0]);
            setCurrentPage('update');
        }
    };

    const isUpdateDisabled = selectedLocationIds.length !== 1;
    
    const isDeleteDisabled = selectedLocationIds.length < 1;

    return (
        <div className="main-content">
            <LocationList 
                locations={serv.filter(searchTerm, selectedRatings)} 
                selectedLocationIds={selectedLocationIds} 
                setSelectedLocationIds={setSelectedLocationIds}
            />
            <button type="button" onClick={() => setCurrentPage('add')}>Add</button>
            <button type="button" onClick={removeElements} disabled={isDeleteDisabled}>Remove</button>
            <button type="button" onClick={() => handleUpdateClick()} disabled={isUpdateDisabled}>Update</button>
        </div>
    )
}

export default Master