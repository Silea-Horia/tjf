import { useState } from 'react';
import './App.css';

import Repository from './repo/Repository'
import Service from './services/Service'

import Sidebar from './components/Sidebar';
import LocationForm from './components/LocationForm';
import Master from './components/Master';

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