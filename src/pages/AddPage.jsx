import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationForm from '../components/LocationForm';

const AddPage = ({ serv, fetchLocations, error, setError }) => {
  const [newLocation, setNewLocation] = useState({ name: '', dateVisited: '', rating: 0 });
  const navigate = useNavigate();

  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      await serv.create(newLocation.name, newLocation.dateVisited, newLocation.rating);
      setNewLocation({ name: '', dateVisited: '', rating: 0 });
      fetchLocations();
      setError(null);
      navigate('/');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData && typeof errorData === 'object') {
          setError(Object.values(errorData).join(', '));
      } else {
          setError('Failed to add location');
      }
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