import { useState, useEffect } from 'react';
import './App.css';
import Service from './services/Service';
import Sidebar from './components/Sidebar';
import LocationForm from './components/LocationForm';
import Master from './components/Master';

const serv = new Service();

function App() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedLocationIds, setSelectedLocationIds] = useState([]);
    const [currentPage, setCurrentPage] = useState('list');
    const [newLocation, setNewLocation] = useState({
        name: '',
        dateVisited: '',
        rating: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const locations = await serv.getAll();
                setData(locations);
            } catch (error) {
                setError('Failed to fetch locations');
            }
        };

        fetchData();

        const updateInterval = setInterval(async () => {
            try {
                const locations = await serv.getAll();
                setData(locations);
            } catch (error) {
                console.error('Error updating data:', error);
            }
        }, 5000);

        return () => {
            serv.stopRandomInsertions();
            clearInterval(updateInterval);
        };
    }, []);

    const handleAddLocation = async (e) => {
        e.preventDefault();
        const result = await serv.create(newLocation.name, newLocation.dateVisited, newLocation.rating);
        if (result == null) {
            setError('Invalid input: Rating must be 0-5, and date must be a valid YYYY-MM-DD format.');
        } else {
            setNewLocation({ name: '', dateVisited: '', rating: 0 });
            setCurrentPage('list');
            const updatedData = await serv.getAll();
            setData(updatedData);
            setError(null);
        }
    };

    const handleUpdateLocation = async (e) => {
        e.preventDefault();
        const result = await serv.update(selectedLocationIds[0], newLocation.name, newLocation.dateVisited, newLocation.rating);
        if (result == null) {
            setError('Invalid input: Rating must be 0-5, and date must be a valid YYYY-MM-DD format.');
        } else {
            setNewLocation({ name: '', dateVisited: '', rating: 0 });
            const updatedData = await serv.getAll();
            setData(updatedData);
            setSelectedLocationIds([]);
            setCurrentPage('list');
            setError(null);
        }
    };

    return (
        <>
            {currentPage === 'list' && (
                <>
                    <Sidebar 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedRatings={selectedRatings}
                        setSelectedRatings={setSelectedRatings}
                    />
                    <Master 
                        serv={serv}
                        data={data}
                        setData={setData}
                        setNewLocation={setNewLocation}
                        searchTerm={searchTerm}
                        selectedRatings={selectedRatings}
                        selectedLocationIds={selectedLocationIds}
                        setSelectedLocationIds={setSelectedLocationIds} 
                        setCurrentPage={setCurrentPage}
                    />
                </>
            )}
            {currentPage === 'add' && (
                <LocationForm 
                    submitHandler={handleAddLocation}
                    newLocation={newLocation}
                    setNewLocation={setNewLocation}
                    setCurrentPage={setCurrentPage}
                    error={error}
                    setError={setError}
                />
            )}
            {currentPage === 'update' && (
                <LocationForm 
                    submitHandler={handleUpdateLocation}
                    newLocation={newLocation}
                    setNewLocation={setNewLocation}
                    setCurrentPage={setCurrentPage}
                    error={error}
                    setError={setError}
                />
            )}
        </>
    );
}

export default App;