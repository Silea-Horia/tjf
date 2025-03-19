import { useState } from 'react';
import './App.css';

import Repository from './repo/Repository'
import Service from './services/Service'

import LocationList from './components/LocationList';
import Sidebar from './components/Sidebar';

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

    const handleInputChange = (e) => {
        const value = e.target.name === 'rating' ? parseInt(e.target.value, 10) : e.target.value;
        setNewLocation({ ...newLocation, [e.target.name]: value });
    };

    const handleAddLocation = (e) => {
        e.preventDefault();
        serv.create(newLocation.name, newLocation.dateVisited, newLocation.rating);
        setNewLocation({ name: '', dateVisited: '', rating: 0 });
        setCurrentPage('list'); 
        setData(serv.getAll());
    };

    const handleCancelClick = () => {
        setNewLocation({ name: '', dateVisited: '', rating: 0 });
        setCurrentPage('list');
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
                <form onSubmit={handleAddLocation}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newLocation.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="dateVisited"
                        value={newLocation.dateVisited}
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="rating"
                        placeholder="Rating"
                        value={newLocation.rating}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancelClick}>Cancel</button>
                </form>
            )}
            {currentPage === 'update' && (
                <form onSubmit={handleUpdateLocation}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newLocation.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="dateVisited"
                        value={newLocation.dateVisited}
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="rating"
                        placeholder="Rating"
                        value={newLocation.rating}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Update</button>
                    <button type="button" onClick={handleCancelClick}>Cancel</button>
                </form>
            )}
        </>
    );
}

export default App;