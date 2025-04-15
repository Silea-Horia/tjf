import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Service from './services/Service';
import useLocations from './hooks/useLocations';
import ListPage from './pages/ListPage';
import AddPage from './pages/AddPage';
import UpdatePage from './pages/UpdatePage';
import {useEffect, useState} from 'react';
import ErrorLabel from './components/ErrorLabel';

const serv = new Service();

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRatings, setSelectedRatings] = useState([]);
  const { locations, totalPages, page, setPage, error, setError, fetchLocations } = useLocations(
      serv,
      searchTerm,
      selectedRatings
  );
  const [connState, setConnState] = useState(serv.getState());

    // Refresh data when server goes online
    useEffect(() => {
        console.log(`App: connState changed to ${connState}`);
        if (connState === 'online') {
            console.log('App: Server is back online, refreshing data');
            fetchLocations(1, false);
        }
    }, [connState, fetchLocations]);

  serv.initListeners(setConnState);

  return (
      <>
        <ErrorLabel connState={connState} />
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
                      totalPages={totalPages}
                      page={page}
                      setPage={setPage}
                  />
                }
            />
            <Route
                path="/add"
                element={<AddPage serv={serv} fetchLocations={fetchLocations} error={error} setError={setError} />}
            />
            <Route
                path="/update/:id"
                element={<UpdatePage serv={serv} fetchLocations={fetchLocations} error={error} setError={setError} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </>
  );
}

export default App;