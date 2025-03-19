import { useState } from 'react';
import './App.css';

import Repository from './repo/Repository'
import Service from './services/Service'

import LocationList from './components/LocationList';
import Sidebar from './components/Sidebar';
import LocationForm from './components/LocationForm';

const initialLocations = [
    { id: 1, name: 'The Eiffel Tower', dateVisited: '2025-08-10', rating: 5 },
    { id: 2, name: 'Sibiu', dateVisited: '2004-01-14', rating: 5 },
];

const repo = new Repository([...initialLocations]);
const serv = new Service(repo);

function App() {

    const [data, setData] = useState(serv.getAll());

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedLocationIds, setSelectedLocationIds] = useState([]);
    const [currentPage, setCurrentPage] = useState('list');
    const [newLocation, setNewLocation] = useState({
        name: '',
        dateVisited: '',
        rating: 0,
    });

    const removeElements = () => {
        selectedLocationIds.forEach(locationId => {
          serv.delete(locationId);
        });
        setData(serv.getAll());
        setSelectedLocationIds([]);
    };


    const handleAddLocation = (e) => {
        e.preventDefault();
        serv.create(newLocation.name, newLocation.dateVisited, newLocation.rating);
        setNewLocation({ name: '', dateVisited: '', rating: 0 });
        setCurrentPage('list'); 
        setData(serv.getAll());
    };


    const handleUpdateLocation = (e) => {
        e.preventDefault();
        serv.update(selectedLocationIds[0], newLocation.name, newLocation.dateVisited, newLocation.rating);
        setNewLocation({ name: '', dateVisited: '', rating: 0 });
        setData(serv.getAll());
        setSelectedLocationIds([]);
        setCurrentPage('list');
    };

    const handleUpdateClick = () => {
        if (selectedLocationIds.length === 1) {
            setNewLocation(data.filter(location => location.id === selectedLocationIds[0])[0]);
        }
        setCurrentPage('update');
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
                </>
            )}
            {currentPage === 'add' && (
                <LocationForm 
                    submitHandler={handleAddLocation}
                    newLocation={newLocation}
                    setNewLocation={setNewLocation}
                    setCurrentPage={setCurrentPage}
                />
            )}
            {currentPage === 'update' && (
                <LocationForm 
                submitHandler={handleUpdateLocation}
                newLocation={newLocation}
                setNewLocation={setNewLocation}
                setCurrentPage={setCurrentPage}
                />
            )}
        </>
    );
}

export default App;