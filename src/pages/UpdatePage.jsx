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
                if (location) {
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
      try {
          await serv.update(id, newLocation.name, newLocation.dateVisited, newLocation.rating);
          setNewLocation({ name: '', dateVisited: '', rating: 0 });
          fetchLocations();
          setError(null);
          navigate('/');
      } catch (err) {
          const errorData = err.response?.data;
          if (errorData && typeof errorData === 'object') {
              setError(Object.values(errorData).join(', '));
          } else {
              setError('Failed to update location');
          }
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