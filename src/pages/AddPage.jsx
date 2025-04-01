import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationForm from '../components/LocationForm';

const AddPage = ({ serv, fetchLocations, error, setError }) => {
  const [newLocation, setNewLocation] = useState({ name: '', dateVisited: '', rating: 0 });
  const navigate = useNavigate();

  const handleAddLocation = async (e) => {
    e.preventDefault();
    const result = await serv.create(newLocation.name, newLocation.dateVisited, newLocation.rating);
    if (result == null) {
      setError('Invalid input: Rating must be 0-5, and date must be a valid YYYY-MM-DD format.');
    } else {
      setNewLocation({ name: '', dateVisited: '', rating: 0 });
      fetchLocations();
      setError(null);
      navigate('/');
    }
  };

  return (
    <LocationForm
      submitHandler={handleAddLocation}
      newLocation={newLocation}
      setNewLocation={setNewLocation}
      setCurrentPage={() => navigate('/')}
      error={error}
      setError={setError}
      title="Add Location"
    />
  );
};

export default AddPage;