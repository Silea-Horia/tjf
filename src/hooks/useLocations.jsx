import { useState, useEffect } from 'react';

const useLocations = (serv, searchTerm, selectedRatings) => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  const fetchLocations = async (page = 1, append = false) => {
    try {
      const data = await serv.getAll(searchTerm, selectedRatings, page);
      setLocations(prev => (append ? [...prev, ...data] : data));
      setError(null);
    } catch (err) {
      setError('Failed to fetch locations');
    }
  };

  useEffect(() => {
    fetchLocations(1); // Fetch first page on mount or filter change
  }, [searchTerm, selectedRatings]);

  return { locations, error, setError, fetchLocations };
};

export default useLocations;