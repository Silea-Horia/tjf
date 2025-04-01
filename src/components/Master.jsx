import React, { useState } from 'react';
import LocationList from './LocationList';
import PaginationControls from './PaginationControls'; // New component
import ActionButtons from './ActionButtons'; // New component
import RatingPieChart from './RatingPieChart'; // New component
import { PIE_CHART_CONFIG } from './constants,jsx'; // New constants file

const Master = ({
  serv,
  data,
  setData,
  setNewLocation,
  searchTerm,
  selectedRatings,
  selectedLocationIds,
  setSelectedLocationIds,
  setCurrentPage,
}) => {
  const [currentListPage, setCurrentListPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isInserting, setIsInserting] = useState(false);

  const filteredLocations = serv
    .filter(data, searchTerm, selectedRatings)
    .sort((a, b) => b.rating - a.rating);
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const paginatedLocations = filteredLocations.slice(
    (currentListPage - 1) * itemsPerPage,
    currentListPage * itemsPerPage
  );

  const handleToggleInsertions = () => {
    if (isInserting) serv.stopRandomInsertions();
    else serv.startRandomInsertions();
    setIsInserting(!isInserting);
  };

  const handleRemove = async () => {
    for (const id of selectedLocationIds) await serv.delete(id);
    setData();
    setSelectedLocationIds([]);
    if ((currentListPage - 1) * itemsPerPage >= filteredLocations.length && currentListPage > 1) {
      setCurrentListPage(currentListPage - 1);
    }
  };

  const handleUpdateClick = async () => {
    if (selectedLocationIds.length === 1) {
      try {
        const location = await serv.read(selectedLocationIds[0]);
        if (location && location.name && location.dateVisited && location.rating !== undefined) {
          setNewLocation({
            name: location.name,
            dateVisited: location.dateVisited,
            rating: location.rating,
          });
          setCurrentPage('update');
        } else {
          alert('Failed to load location data for update.');
        }
      } catch (error) {
        alert(`Error fetching location: ${error.message}`);
      }
    }
  };

  return (
    <div className="main-content">
      <LocationList
        locations={paginatedLocations}
        allLocations={filteredLocations}
        selectedLocationIds={selectedLocationIds}
        setSelectedLocationIds={setSelectedLocationIds}
        currentListPage={currentListPage}
        itemsPerPage={itemsPerPage}
      />
      <RatingPieChart data={data} />
      <ActionButtons
        onAdd={() => setCurrentPage('add')}
        onRemove={handleRemove}
        onUpdate={handleUpdateClick}
        onToggleInsertions={handleToggleInsertions}
        isInserting={isInserting}
        isDeleteDisabled={selectedLocationIds.length < 1}
        isUpdateDisabled={selectedLocationIds.length !== 1}
      />
      <PaginationControls
        currentPage={currentListPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentListPage}
      />
    </div>
  );
};

export default Master;