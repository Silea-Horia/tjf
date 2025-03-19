import React, { useState } from 'react'

const LocationForm = ({submitHandler, newLocation, setNewLocation, setCurrentPage}) => {
    const handleInputChange = (e) => {
        const value = e.target.name === 'rating' ? parseInt(e.target.value, 10) : e.target.value;
        setNewLocation({ ...newLocation, [e.target.name]: value });
    };

    const handleCancelClick = () => {
        setNewLocation({ name: '', dateVisited: '', rating: 0 });
        setCurrentPage('list');
    };

    return (
        <form onSubmit={submitHandler}>
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
    )
}

export default LocationForm