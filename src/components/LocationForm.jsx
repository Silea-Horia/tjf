import React, { useState, useEffect } from 'react';
import './Form.css';

const LocationForm = ({ submitHandler, newLocation, setNewLocation, setCurrentPage, error, setError }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.name === 'rating' ? parseInt(e.target.value, 10) || 0 : e.target.value;
        setNewLocation({ ...newLocation, [e.target.name]: value });
        setError(null);
    };

    const handleCancelClick = () => {
        setNewLocation({ name: '', dateVisited: '', rating: 0 });
        setCurrentPage('list');
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await submitHandler(e);
        } catch (err) {
            console.error('Submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (error) {
            alert(error);
        }
    }, [error]);

    // Ensure newLocation has default values to prevent undefined errors
    const safeNewLocation = {
        name: newLocation?.name || '',
        dateVisited: newLocation?.dateVisited || '',
        rating: newLocation?.rating ?? 0, // Use ?? to handle null/undefined explicitly
    };

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <h1>Location details</h1>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={safeNewLocation.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />
                <input
                    type="date"
                    name="dateVisited"
                    value={safeNewLocation.dateVisited}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                />
                <input
                    type="number"
                    name="rating"
                    placeholder="Rating"
                    value={safeNewLocation.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    disabled={isSubmitting}
                />
                <button className='button' type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button
                    className='button'
                    type="button"
                    onClick={handleCancelClick}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default LocationForm;