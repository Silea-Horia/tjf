import { useState, useEffect, useCallback } from 'react';

const useLocations = (serv, searchTerm, selectedRatings) => {
  const [locations, setLocations] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchLocations = useCallback(
      async (newPage = 1, append = false) => {
        if (isFetching) {
          console.log(`useLocations: Skipping fetch, already in progress for page=${newPage}`);
          return;
        }

        setIsFetching(true);
        try {
          console.log(`useLocations: Fetching page=${newPage}, append=${append}`, {
            searchTerm,
            selectedRatings,
          });
          const response = await serv.getAll(searchTerm, selectedRatings, newPage);

          if (!response || typeof response !== 'object') {
            throw new Error('Invalid API response');
          }

          const newContent = Array.isArray(response.content) ? response.content : [];
          console.log(`useLocations: Received ${newContent.length} items for page ${newPage}`);

          if (newContent.length === 0 && newPage > 1) {
            console.log(`useLocations: Empty content for page ${newPage}, stopping fetch`);
            setTotalPages(newPage - 1);
            return;
          }

          setLocations((prevLocations) => {
            const currentLocations = Array.isArray(prevLocations) ? prevLocations : [];
            // Only deduplicate when appending to avoid filtering out valid page 1 data
            const existingIds = append ? new Set(currentLocations.map((loc) => loc.id)) : new Set();
            const uniqueNewContent = newContent.filter((loc) => !existingIds.has(loc.id));
            console.log(
                `useLocations: Deduplicated. Original new content length=${newContent.length}, Unique new content length=${uniqueNewContent.length}`
            );

            const updatedLocations = append
                ? [...currentLocations, ...uniqueNewContent]
                : uniqueNewContent;
            console.log(
                `useLocations: Updating locations. Prev length=${currentLocations.length}, New content length=${uniqueNewContent.length}, New total length=${updatedLocations.length}`
            );

            return updatedLocations;
          });

          const receivedTotalPages =
              response.totalPages != null && !isNaN(response.totalPages) ? Number(response.totalPages) : 1;
          console.log(`useLocations: Setting totalPages=${receivedTotalPages}, page=${newPage}`);
          setTotalPages(receivedTotalPages);
          setPage(newPage);

          setError(null);
        } catch (err) {
          console.error('useLocations: Failed to fetch locations', err);
          setError('Failed to fetch locations');
        } finally {
          setIsFetching(false);
        }
      },
      [serv, searchTerm, selectedRatings]
  );

  // Log dependency changes for debugging
  useEffect(() => {
    console.log('useLocations: useEffect triggered', {
      searchTerm,
      selectedRatings: selectedRatings.slice(),
      fetchLocations: fetchLocations.toString().slice(0, 50),
    });
    setPage(1);
    setLocations([]);
    fetchLocations(1, false);
  }, [searchTerm, selectedRatings, fetchLocations]);

  return { locations, totalPages, page, setPage, error, setError, fetchLocations };
};

export default useLocations;