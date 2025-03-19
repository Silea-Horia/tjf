import { useState } from 'react';
import './App.css';

import Repository from './repo/Repository'
import Service from './services/Service'

function App() {
    const initialLocations = [
        { id: 1, name: 'The Eiffel Tower', dateVisited: '2025-08-10', rating: 5 },
        { id: 2, name: 'Sibiu', dateVisited: '2004-01-14', rating: 5 },
    ];
    const repo = new Repository([...initialLocations]);
    const serv = new Service(repo);

    const [data, setData] = useState(serv.getAll());

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
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
        setSelectedLocations((prevLocations) =>
            prevLocations.includes(location.id)
                ? prevLocations.filter((id) => id !== location.id)
                : [...prevLocations, location.id]
        );
    };

    // const filteredData = data.filter((location) => {
    //     const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase());
    //     const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(location.rating);
    //     return matchesSearch && matchesRating;
    // });

    const filteredData = serv.filter(searchTerm, selectedRatings);

    const removeElements = () => {
        selectedLocations.forEach(location => {
          console.log(location.id);
          serv.delete(location.id);
        });
        setData(serv.getAll());
        setSelectedLocations([]);
        // const filteredLocations = data.filter(
        //     (location) => !selectedLocations.includes(location.id)
        // );
        // setData(filteredLocations);
        // setSelectedLocations([]);
    };

    const handleInputChange = (e) => {
        const value = e.target.name === 'rating' ? parseInt(e.target.value, 10) : e.target.value;
        setNewLocation({ ...newLocation, [e.target.name]: value });
    };

    const handleAddLocation = (e) => {
        e.preventDefault();
        const newId = data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1;
        setData([...data, { ...newLocation, id: newId }]);
        setNewLocation({ name: '', dateVisited: '', rating: 0 });
        setCurrentPage('list'); 
    };

    const handleCancelClick = () => {
        setNewLocation({ name: '', dateVisited: '', rating: 0 });
        setCurrentPage('list');
    };

    const handleUpdateLocation = (e) => {
        e.preventDefault();
        const updatedData = data.map((item) =>
            item.id === selectedLocations[0] ? newLocation : item // Corrected line
        );
        setData(updatedData);
        setNewLocation({ name: '', dateVisited: '', rating: 0 });
        setSelectedLocations([]);
        setCurrentPage('list');
    };
    const handleUpdateClick = () => {
        if (selectedLocations.length === 1) {
            setNewLocation(data.filter(location => location.id === selectedLocations[0])[0]);
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
                                                checked={selectedLocations.includes(location.id)}
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