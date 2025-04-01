import React, { useState } from 'react';
import LocationList from './LocationList';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Master = ({
    serv,
    data,
    setData,
    setNewLocation,
    searchTerm,
    selectedRatings,
    selectedLocationIds,
    setSelectedLocationIds,
    setCurrentPage
}) => {
    const [currentListPage, setCurrentListPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isInserting, setIsInserting] = useState(false);

    const toggleInsertions = () => {
        if (isInserting) {
            serv.stopRandomInsertions();
        } else {
            serv.startRandomInsertions();
        }
        setIsInserting(!isInserting);
    };

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentListPage(1);
    };

    const removeElements = async () => {
        for (const locationId of selectedLocationIds) {
            await serv.delete(locationId);
        }
        const updatedData = await serv.getAll();
        setData(updatedData);
        setSelectedLocationIds([]);

        const filteredLocations = serv.filter(updatedData, searchTerm, selectedRatings);
        if ((currentListPage - 1) * itemsPerPage >= filteredLocations.length && currentListPage > 1) {
            setCurrentListPage(currentListPage - 1);
        }
    };

    const handleUpdateClick = async () => {
        if (selectedLocationIds.length === 1) {
            try {
                const location = await serv.read(selectedLocationIds[0]);
                console.log('Fetched location:', location); // Debug: Check the API response
                if (location && location.name && location.dateVisited && location.rating !== undefined) {
                    setNewLocation({
                        name: location.name,
                        dateVisited: location.dateVisited,
                        rating: location.rating,
                    });
                    setCurrentPage('update');
                } else {
                    console.error('Invalid location data:', location);
                    alert('Failed to load location data for update.');
                }
            } catch (error) {
                console.error('Error fetching location for update:', error);
                alert('An error occurred while fetching the location.');
            }
        }
    };

    const isUpdateDisabled = selectedLocationIds.length !== 1;
    const isDeleteDisabled = selectedLocationIds.length < 1;

    const filteredLocations = serv.filter(data, searchTerm, selectedRatings).sort((a, b) => b.rating - a.rating);
    const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
    const startIndex = (currentListPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentListPage(newPage);
        }
    };

    const ratingCounts = [0, 1, 2, 3, 4, 5].map(rating =>
        data.filter(loc => loc.rating === rating).length
    );

    const pieChartData = {
        labels: ['0 Stars', '1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [{
            data: ratingCounts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            hoverOffset: 4,
        }],
    };

    const pieChartOptions = {
        plugins: { legend: { position: 'right' } },
        maintainAspectRatio: false,
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
            <div style={{ height: '500px', margin: '300px 500px', position: 'absolute' }}>
                <Pie data={pieChartData} options={pieChartOptions} />
            </div>
            <div className='button-container'>
                <button className='button' type="button" onClick={() => setCurrentPage('add')}>Add</button>
                <button className='button' type="button" onClick={removeElements} disabled={isDeleteDisabled}>Remove</button>
                <button className='button' type="button" onClick={handleUpdateClick} disabled={isUpdateDisabled}>Update</button>
                <button className='button' type="button" onClick={toggleInsertions}>
                    {isInserting ? 'Stop Insertions' : 'Start Insertions'}
                </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', alignItems: 'center' }}>
                <label htmlFor="itemsPerPage" style={{ marginRight: '10px' }}>Items per page:</label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} style={{ marginRight: '20px', padding: '5px' }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
                {totalPages > 1 && (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Master;