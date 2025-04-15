import React, { useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LocationCard from './LocationCard';

const LocationList = ({
                        locations,
                        totalPages,
                        selectedLocationIds,
                        setSelectedLocationIds,
                        fetchLocations,
                        page,
                        setPage,
                      }) => {
  const hasMore = page < totalPages;

  const handleLocationChange = (location) => {
    setSelectedLocationIds((prevLocations) =>
        prevLocations.includes(location.id)
            ? prevLocations.filter((id) => id !== location.id)
            : [...prevLocations, location.id]
    );
  };

  const loadMore = useCallback(async () => {
    if (page >= totalPages) {
      console.log('LocationList: No more pages to load', { page, totalPages });
      return;
    }
    const nextPage = page + 1;
    console.log('LocationList: Loading page', nextPage, { currentPage: page, totalPages });
    try {
      await fetchLocations(nextPage, true);
      setPage(nextPage);
      console.log('LocationList: Successfully fetched page', nextPage);
    } catch (err) {
      console.error('LocationList: loadMore error:', err);
    }
  }, [page, totalPages, fetchLocations, setPage]);

  const getRowColor = (index) => {
    const thirdSize = Math.floor(locations.length / 3);
    if (index < thirdSize) return 'yellow';
    else if (index >= 2 * thirdSize) return 'red';
    else return 'orange';
  };

  useEffect(() => {
    console.log('LocationList: State update', {
      page,
      totalPages,
      hasMore,
      locationsLength: locations.length,
    });
    const scrollableDiv = document.getElementById('scrollableDiv');
    if (scrollableDiv) {
      console.log('LocationList: Scrollable div stats', {
        scrollHeight: scrollableDiv.scrollHeight,
        clientHeight: scrollableDiv.clientHeight,
        scrollTop: scrollableDiv.scrollTop,
      });
    }
  }, [page, totalPages, hasMore, locations.length]);

  return (
      <div id="scrollableDiv" style={{ height: '30vh', overflowY: 'auto' }}>
        <InfiniteScroll
            dataLength={locations.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more locations to load</p>}
            scrollableTarget="scrollableDiv"
        >
          <table className="table">
            <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Date Visited</th>
              <th>Rating</th>
            </tr>
            </thead>
            <tbody>
            {locations.map((location, index) => (
                <LocationCard
                    key={location.id}
                    location={location}
                    backgroundColor={getRowColor(index)}
                    handleLocationChange={handleLocationChange}
                    selectedLocationIds={selectedLocationIds}
                />
            ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
  );
};

export default LocationList;