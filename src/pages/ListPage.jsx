import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Master from '../components/Master';

const ListPage = ({ locations, serv, fetchLocations, searchTerm, setSearchTerm, selectedRatings, setSelectedRatings }) => {
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);

  return (
    <>
      <Sidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRatings={selectedRatings}
        setSelectedRatings={setSelectedRatings}
      />
      <Master
        serv={serv}
        data={locations}
        setData={fetchLocations}
        searchTerm={searchTerm}
        selectedRatings={selectedRatings}
        selectedLocationIds={selectedLocationIds}
        setSelectedLocationIds={setSelectedLocationIds}
      />
    </>
  );
};

export default ListPage;