import React, { useState } from 'react';
import './Form.css';

const LocationForm = ({ submitHandler, newLocation, setNewLocation, setCurrentPage, error, setError, title = 'Location Details' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseErrors = (error) => {
    if (!error || typeof error !== 'object') return {};
    return Object.entries(error).reduce((acc, [field, message]) => {
      acc[field] = message;
      return acc;
    }, {});
  };

  const fieldErrors = error && typeof error === 'object' ? parseErrors(error) : {};

  const handleInputChange = (e) => {
    const value = e.target.name === 'rating' ? parseInt(e.target.value, 10) || 0 : e.target.value;
    setNewLocation({ ...newLocation, [e.target.name]: value });
    setError(null);
  };

  const handleCancel = () => {
    setNewLocation({ name: '', dateVisited: '', rating: 0 });
    setCurrentPage();
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    submitHandler(e).finally(() => setIsSubmitting(false));
  };

  const safeNewLocation = {
    name: newLocation?.name || '',
    dateVisited: newLocation?.dateVisited || '',
    rating: newLocation?.rating ?? 0,
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>{title}</h1>
        <div className="form-field">
          <label>
            Name:
            <input
              type="text"
              name="name"
              placeholder={newLocation.name == "" ? "Name" : newLocation.name}
              value={safeNewLocation.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </label>
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>
        <div className="form-field">
          <label>
            Date Visited:
            <input
              type="date"
              name="dateVisited"
              value={safeNewLocation.dateVisited}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </label>
          {fieldErrors.dateVisited && <span className="field-error">{fieldErrors.dateVisited}</span>}
        </div>
        <div className="form-field">
          <label>
            Rating:
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
          </label>
          {fieldErrors.rating && <span className="field-error">{fieldErrors.rating}</span>}
        </div>
        <div className="form-buttons">
          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="button" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
        {error && !Object.keys(fieldErrors).length && (
          <p className="error-message">{error}</p>
        )}
      </form>
    </div>
  );
};

export default LocationForm;