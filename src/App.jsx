import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Service from './services/Service';
import useLocations from './hooks/useLocations';
import ListPage from './pages/ListPage'; 
import AddPage from './pages/AddPage'; 
import UpdatePage from './pages/UpdatePage'; 
import { useState } from 'react';

const serv = new Service();

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRatings, setSelectedRatings] = useState([]);
  const { locations, error, setError, fetchLocations } = useLocations(serv, searchTerm, selectedRatings);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
          <ListPage 
            locations={locations} 
            serv={serv} 
            fetchLocations={fetchLocations} 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRatings={selectedRatings}
            setSelectedRatings={setSelectedRatings}
          />} 
        />
        <Route
          path="/add"
          element={<AddPage serv={serv} fetchLocations={fetchLocations} error={error} setError={setError} />}
        />
        <Route
          path="/update/:id"
          element={<UpdatePage serv={serv} fetchLocations={fetchLocations} error={error} setError={setError} />}
        />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes to home */}
      </Routes>
    </Router>
  );
}

export default App;