import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationList from './LocationList';
import PaginationControls from './PaginationControls';
import ActionButtons from './ActionButtons';
import RatingPieChart from './RatingPieChart';
import { PIE_CHART_CONFIG } from './constants.js';

const Master = ({
  serv,
  data,
  setData,
  searchTerm,
  selectedRatings,
  selectedLocationIds,
  setSelectedLocationIds,
}) => {
  const [currentListPage, setCurrentListPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isInserting, setIsInserting] = useState(false);
  const navigate = useNavigate();

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedLocations = data.slice(
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
    if ((currentListPage - 1) * itemsPerPage >= data.length && currentListPage > 1) {
      setCurrentListPage(currentListPage - 1);
    }
  };

  const handleUpdateClick = async () => {
    if (selectedLocationIds.length === 1) {
      navigate(`/update/${selectedLocationIds[0]}`);
    }
  };

  return (
    <div className="main-content">
      <LocationList
        locations={paginatedLocations}
        allLocations={data}
        selectedLocationIds={selectedLocationIds}
        setSelectedLocationIds={setSelectedLocationIds}
        currentListPage={currentListPage}
        itemsPerPage={itemsPerPage}
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