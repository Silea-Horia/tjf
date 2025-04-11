// components/Master.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationList from './LocationList';
import ActionButtons from './ActionButtons';
import RatingPieChart from './RatingPieChart';

const Master = ({
  serv,
  data,
  setData,
  searchTerm,
  selectedRatings,
  selectedLocationIds,
  setSelectedLocationIds,
}) => {
  const [isInserting, setIsInserting] = useState(false);
  const navigate = useNavigate();

  const handleToggleInsertions = () => {
    if (isInserting) serv.stopRandomInsertions();
    else serv.startRandomInsertions();
    setIsInserting(!isInserting);
  };

  const handleRemove = async () => {
    for (const id of selectedLocationIds) await serv.delete(id);
    setData(); // Refresh data
    setSelectedLocationIds([]);
  };

  const handleUpdateClick = async () => {
    if (selectedLocationIds.length === 1) {
      navigate(`/update/${selectedLocationIds[0]}`);
    }
  };

  return (
    <div className="main-content">
      <LocationList
        allLocations={data}
        selectedLocationIds={selectedLocationIds}
        setSelectedLocationIds={setSelectedLocationIds}
        fetchLocations={setData} // Pass fetchLocations for infinite scroll
        searchTerm={searchTerm}
        selectedRatings={selectedRatings}
      />
      <RatingPieChart data={data} />
      <ActionButtons
        onAdd={() => navigate('/add')}
        onRemove={handleRemove}
        onUpdate={handleUpdateClick}
        onToggleInsertions={handleToggleInsertions}
        isInserting={isInserting}
        isDeleteDisabled={selectedLocationIds.length < 1}
        isUpdateDisabled={selectedLocationIds.length !== 1}
      />
    </div>
  );
};

export default Master;