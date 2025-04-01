import { useState, useEffect } from 'react';

const useLocations = (service) => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    try {
      const data = await service.getAll();
      setLocations(data);
    } catch (err) {
      setError('Failed to fetch locations');
      console.error('Error fetching locations:', err);
    }
  };

  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, 5000);
    return () => {
      service.stopRandomInsertions();
      clearInterval(interval);
    };
  }, [service]);

  return { locations, error, setError, fetchLocations };
};

export default useLocations;