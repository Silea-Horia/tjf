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

    const filteredLocations = serv.filter(searchTerm, selectedRatings).sort((a, b) => b.rating - a.rating);
    const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
    const startIndex = (currentListPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentListPage(newPage);
        }
    };

    return (
        <div className="main-content">
            <LocationList 
                locations={paginatedLocations} 
                allLocations={filteredLocations}
                selectedLocationIds={selectedLocationIds} 
                setSelectedLocationIds={setSelectedLocationIds}
                currentListPage={currentListPage}
                itemsPerPage={itemsPerPage}
            />
            <div className='button-container'>
                <button className='button' type="button" onClick={() => setCurrentPage('add')}>Add</button>
                <button className='button' type="button" onClick={removeElements} disabled={isDeleteDisabled}>Remove</button>
                <button className='button' type="button" onClick={() => handleUpdateClick()} disabled={isUpdateDisabled}>Update</button>
            </div>
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <button
                        className='button' 
                        onClick={() => handlePageChange(currentListPage - 1)} 
                        disabled={currentListPage === 1}
                    >
                        Previous
                    </button>
                    <span style={{ margin: '0 10px', alignSelf: 'center' }}>
                        Page {currentListPage} of {totalPages}
                    </span>
                    <button 
                        className='button' 
                        onClick={() => handlePageChange(currentListPage + 1)} 
                        disabled={currentListPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default Master