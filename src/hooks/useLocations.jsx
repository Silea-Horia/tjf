import { useState, useEffect } from 'react';

const useLocations = (service, searchTerm = '', ratings = []) => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    try {
      const data = await service.getAll(searchTerm, ratings);
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
  }, [service, searchTerm, ratings]);

  return { locations, error, setError, fetchLocations };
};

export default useLocations;