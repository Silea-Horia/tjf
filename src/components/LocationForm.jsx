import React, { useState } from 'react'
import './Form.css'

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
        <div className='form-container'>
            <form onSubmit={submitHandler}>
                <h1>Location details</h1>
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
                <button className='button' type="submit">Save</button>
                <button className='button' type="button" onClick={handleCancelClick}>Cancel</button>
            </form>
        </div>
    )
}

export default LocationForm