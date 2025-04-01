import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LocationForm from '../components/LocationForm';

const UpdatePage = ({ serv, fetchLocations, error, setError }) => {
  const [newLocation, setNewLocation] = useState({ name: '', dateVisited: '', rating: 0 });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const location = await serv.read(parseInt(id));
        if (location && location.name && location.dateVisited && location.rating !== undefined) {
          setNewLocation({
            name: location.name,
            dateVisited: location.dateVisited,
            rating: location.rating,
          });
        } else {
          setError('Failed to load location data for update.');
          navigate('/');
        }
      } catch (err) {
        setError(`Error fetching location: ${err.message}`);
        navigate('/');
      }
    };
    fetchLocation();
  }, [id, serv, setError, navigate]);

  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    const result = await serv.update(id, newLocation.name, newLocation.dateVisited, newLocation.rating);
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
      submitHandler={handleUpdateLocation}
      newLocation={newLocation}
      setNewLocation={setNewLocation}
      setCurrentPage={() => navigate('/')}
      error={error}
      setError={setError}
      title="Update Location"
    />
  );
};

export default UpdatePage;