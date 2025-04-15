import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationList from './LocationList';
import ActionButtons from './ActionButtons';
import RatingPieChart from './RatingPieChart';

const Master = ({
                    serv,
                    locations,
                    totalPages,
                    fetchLocations,
                    selectedLocationIds,
                    setSelectedLocationIds,
                    page,
                    setPage,
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
        fetchLocations(1, false); // Reset to first page after deletion
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
                locations={locations}
                totalPages={totalPages}
                selectedLocationIds={selectedLocationIds}
                setSelectedLocationIds={setSelectedLocationIds}
                fetchLocations={fetchLocations}
                page={page}
                setPage={setPage}
            />
            {/* <RatingPieChart data={locations} /> */}
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