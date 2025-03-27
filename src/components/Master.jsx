import React, {useState} from 'react'
import LocationList from './LocationList'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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

    const ratingCounts = [0, 1, 2, 3, 4, 5].map(rating =>
        serv.getAll().filter(loc => loc.rating === rating).length
    );

    const pieChartData = {
        labels: ['0 Stars', '1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [{
            data: ratingCounts,
            backgroundColor: [
                '#FF6384', // 0 stars
                '#36A2EB', // 1 star
                '#FFCE56', // 2 stars
                '#4BC0C0', // 3 stars
                '#9966FF', // 4 stars
                '#FF9F40', // 5 stars
            ],
            hoverOffset: 4,
        }],
    };

    const pieChartOptions = {
        plugins: {
            legend: {
                position: 'right',
            },
        },
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