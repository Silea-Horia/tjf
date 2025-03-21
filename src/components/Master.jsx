import React, {useState} from 'react'
import LocationList from './LocationList'

const Master = ({serv, setData, setNewLocation, searchTerm, selectedRatings, selectedLocationIds, setSelectedLocationIds, setCurrentPage}) => {
    const [currentListPage, setCurrentListPage] = useState(1);
    const itemsPerPage = 5;

    const removeElements = () => {
        selectedLocationIds.forEach(locationId => {
          serv.delete(locationId);
        });
        setData(serv.getAll());
        setSelectedLocationIds([]);

        const filteredLocations = serv.filter(searchTerm, selectedRatings);
        if ((currentListPage - 1) * itemsPerPage >= filteredLocations.length) {
            setCurrentListPage(currentListPage - 1);
        }
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
            <div className='button-container'>
                <button className='button' type="button" onClick={() => setCurrentPage('add')}>Add</button>
                <button className='button' type="button" onClick={removeElements} disabled={isDeleteDisabled}>Remove</button>
                <button className='button' type="button" onClick={() => handleUpdateClick()} disabled={isUpdateDisabled}>Update</button>
            </div>
            </div>
    )
}

export default Master