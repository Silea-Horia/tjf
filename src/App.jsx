import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Service from './services/Service';
import useLocations from './hooks/useLocations';
import Sidebar from './components/Sidebar';
import LocationForm from './components/LocationForm';
import Master from './components/Master';
import ListPage from './pages/ListPage'; // New component
import AddPage from './pages/AddPage'; // New component
import UpdatePage from './pages/UpdatePage'; // New component

const serv = new Service();

function App() {
  const { locations, error, setError, fetchLocations } = useLocations(serv);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListPage locations={locations} serv={serv} fetchLocations={fetchLocations} />} />
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