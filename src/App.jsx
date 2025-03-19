import { useState } from 'react';
import './App.css';

import Repository from './repo/Repository'
import Service from './services/Service'

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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('list');
    const [newLocation, setNewLocation] = useState({
        name: '',
        dateVisited: '',
        rating: 0,
    });

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleRatingChange = (rating) => {
        setSelectedRatings((prevRatings) =>
            prevRatings.includes(rating)
                ? prevRatings.filter((r) => r !== rating)
                : [...prevRatings, rating]
        );
    };

    const handleLocationChange = (location) => {
        setSelectedLocationIds((prevLocations) =>
            prevLocations.includes(location.id)
                ? prevLocations.filter((id) => id !== location.id)
                : [...prevLocations, location.id]
        );
    };

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
                    <div className="sidebar">
                        <input
                            type="text"
                            placeholder="Search"
                            className="searchbar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="filters">
                            <div className="dropdown">
                                <button onClick={toggleDropdown} className="dropdown-button">
                                    Filter by Rating
                                </button>
                                {dropdownOpen && (
                                    <div className="dropdown-menu">
                                        {[0, 1, 2, 3, 4, 5].map((rating) => (
                                            <label key={rating} className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    value={rating}
                                                    checked={selectedRatings.includes(rating)}
                                                    onChange={() => handleRatingChange(rating)}
                                                />
                                                {rating} Stars
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="main-content">
                        <table className="table">
                            <tbody>
                                {serv.filter(searchTerm, selectedRatings).map((location) => (
                                    <tr key={location.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleLocationChange(location)}
                                                checked={selectedLocationIds.includes(location.id)}
                                            />
                                        </td>
                                        <td>{location.name}</td>
                                        <td>{location.dateVisited}</td>
                                        <td>{location.rating}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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