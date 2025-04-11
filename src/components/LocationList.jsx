// components/LocationList.js
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LocationCard from './LocationCard';

const LocationList = ({
  allLocations,
  selectedLocationIds,
  setSelectedLocationIds,
  fetchLocations,
  searchTerm,
  selectedRatings,
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleLocationChange = (location) => {
    setSelectedLocationIds((prevLocations) =>
      prevLocations.includes(location.id)
        ? prevLocations.filter((id) => id !== location.id)
        : [...prevLocations, location.id]
    );
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    console.log(`Loading page ${nextPage}`);
    try {
      await fetchLocations(nextPage, true); // Append data
      console.log('Fetched data:', allLocations.length, 'items');
      setPage(nextPage);
      // Check if the last fetch returned fewer than 10 items
      if (allLocations.length % 10 !== 0 || allLocations.length === 0) {
        console.log('No more data to load');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more:', error);
      setHasMore(false);
    }
  };

  const getRowColor = (index) => {
    const thirdSize = Math.floor(allLocations.length / 3);
    if (index < thirdSize) return 'yellow';
    else if (index >= 2 * thirdSize) return 'red';
    else return 'orange';
  };

  return (
    <InfiniteScroll
      dataLength={allLocations.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={<p>No more locations to load</p>}
      style={{ overflow: 'auto', maxHeight: '30vh' }}
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
          {allLocations.map((location, index) => (
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
  );
};

export default LocationList;