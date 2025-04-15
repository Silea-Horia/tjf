import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Master from '../components/Master';

const ListPage = ({
                      locations,
                      serv,
                      fetchLocations,
                      searchTerm,
                      setSearchTerm,
                      selectedRatings,
                      setSelectedRatings,
                      totalPages,
                      page,
                      setPage,
                  }) => {
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
                locations={locations}
                totalPages={totalPages}
                fetchLocations={fetchLocations}
                selectedLocationIds={selectedLocationIds}
                setSelectedLocationIds={setSelectedLocationIds}
                page={page}
                setPage={setPage}
            />
        </>
    );
};

export default ListPage;