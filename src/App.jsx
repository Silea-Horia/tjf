import { useState, useEffect } from 'react';
import './App.css';
import Service from './services/Service';
import Sidebar from './components/Sidebar';
import LocationForm from './components/LocationForm';
import Master from './components/Master';
import useLocations from './hooks/useLocations';

const serv = new Service();

function App() {
  const [currentPage, setCurrentPage] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: '',
    dateVisited: '',
    rating: 0,
  });

  const { locations, error, setError, fetchLocations } = useLocations(serv);

  const handleSaveLocation = async (e, isUpdate = false) => {
    e.preventDefault();
    const action = isUpdate
      ? serv.update(selectedLocationIds[0], newLocation.name, newLocation.dateVisited, newLocation.rating)
      : serv.create(newLocation.name, newLocation.dateVisited, newLocation.rating);

    const result = await action;
    if (result == null) {
      setError('Invalid input: Rating must be 0-5, and date must be a valid YYYY-MM-DD format.');
    } else {
      setNewLocation({ name: '', dateVisited: '', rating: 0 });
      if (isUpdate) setSelectedLocationIds([]);
      setCurrentPage('list');
      fetchLocations(); // Refresh data
      setError(null);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'list':
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
              setNewLocation={setNewLocation}
              searchTerm={searchTerm}
              selectedRatings={selectedRatings}
              selectedLocationIds={selectedLocationIds}
              setSelectedLocationIds={setSelectedLocationIds}
              setCurrentPage={setCurrentPage}
            />
          </>
        );
      case 'add':
        return (
          <LocationForm
            submitHandler={handleSaveLocation}
            newLocation={newLocation}
            setNewLocation={setNewLocation}
            setCurrentPage={setCurrentPage}
            error={error}
            setError={setError}
          />
        );
      case 'update':
        return (
          <LocationForm
            submitHandler={(e) => handleSaveLocation(e, true)}
            newLocation={newLocation}
            setNewLocation={setNewLocation}
            setCurrentPage={setCurrentPage}
            error={error}
            setError={setError}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderPage()}</>;
}

export default App;