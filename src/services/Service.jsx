import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/locations';

class Service {
  constructor() {
    this.isRunning = false;
    this.insertionInterval = null;
    this.offlineQueue = [];
    this.offlineCopy = [];
    this.setConnState = null;
    this.serverDown = false;
  }

  // state
  initListeners(setConnState) {
    this.loadQueueFromStorage();

    window.addEventListener('online', () => {
      setConnState('online');
      this.pushToServer();
    });
    window.addEventListener('offline', () => setConnState('offline'));

    this.setConnState = setConnState;
  }

  getState() {
    return this.serverDown ? 'server down' : (window.navigator.onLine ? 'online' : 'offline');
  }

  saveQueueToStorage() {
    localStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
  }

  loadQueueFromStorage() {
    const storedQueue = localStorage.getItem('offlineQueue');
    this.offlineQueue = storedQueue ? JSON.parse(storedQueue) : [];
  }

  async pushToServer() {
    if (this.getState() != 'online' || this.offlineQueue.length == 0) return;
    
    const queueCopy = [...this.offlineQueue];
    this.offlineQueue = [];
    this.saveQueueToStorage();

    for (const { action, data } of queueCopy) {
      try {
        if (action === 'create') {
          const { name, dateVisited, rating } = data;
          await this.create(name, dateVisited, rating);
          console.log(`Synced create for ${name}`);
        } else if (action === 'update') {
          const { id, name, dateVisited, rating } = data;
          await this.update(id, name, dateVisited, rating);
          console.log(`Synced update for ${id}`);
        } else if (action == 'delete') {
          const id = data;
          await this.delete(id);
          console.log(`Synced delete for ${id}`);
        }
      } catch (error) {
      }
    }
    this.saveQueueToStorage();
  }

  // CRUD Operations
  async getAll(searchTerm = '', ratings = []) {
    if (this.getState() === 'offline') {
      return this.offlineCopy;
    }
    
    try {
      const params = new URLSearchParams();

      if (searchTerm) params.append('name', searchTerm);

      ratings.forEach(rating => params.append('ratings', rating));

      const response = await axios.get(`${REST_API_BASE_URL}?${params.toString()}`);

      this.serverDown = false;
      this.setConnState(this.getState());
      this.pushToServer();

      this.offlineCopy = response.data;

      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error.message, error.response?.data);

      this.setConnState('serverDown');
      this.serverDown = true;

      return this.offlineCopy;
    }
  }

  async create(name, dateVisited, rating) {
    if (this.getState() == 'online') {
      try {
        const response = await axios.post(REST_API_BASE_URL, { name, dateVisited, rating });
        return response.data;
      } catch (error) {
        console.error('Error creating location:', error.message);
        throw error;
      }
    }
    else {
      const location = {name, dateVisited, rating};
      this.offlineQueue.push({action: 'create', data: location});
      this.saveQueueToStorage();
      let id = this.offlineCopy.length;
      this.offlineCopy.push({id: id, ...location});
      return location;
    }
  }

  async read(id) {
    if (this.getState() == 'online') {
      try {
        const response = await axios.get(`${REST_API_BASE_URL}/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error reading location:', error.message);
        return null;
      }
    } else {
      const foundLocation = this.offlineCopy.find(location => location.id == id) || null;
      return foundLocation;
    }
  }

  async update(id, name, dateVisited, rating) {
    if (this.getState() == 'online')
    {
      try {
        const response = await axios.put(`${REST_API_BASE_URL}/${id}`, { name, dateVisited, rating });
        return response.data;
      } catch (error) {
        console.error('Error updating location:', error.message);
        throw null;
      }
    }
    else {
      const location = {id, name, dateVisited, rating};
      this.offlineQueue.push({action: 'update', data: location});
      this.saveQueueToStorage();
      this.offlineCopy = this.offlineCopy.map(elem =>
        elem.id == id ? { ...elem, name, dateVisited, rating } : elem
      );
      return location;
    }
  }

  async delete(id) {
    if (this.getState() == 'online') {
      try {
        await axios.delete(`${REST_API_BASE_URL}/${id}`);
        return true;
      } catch (error) {
        console.error('Error deleting location:', error.message);
        return false;
      }
    } else {
      this.offlineQueue.push({action: 'delete', data: id});
      this.saveQueueToStorage();
      this.offlineCopy = this.offlineCopy.filter(location => location.id != id);
      return true; 
    }
  }

  // Random Data Generation
  getRandomDate() {
    const year = Math.floor(Math.random() * (2025 - 2000 + 1)) + 2000;
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async insertRandomRecord() {
    const placeNames = ['Paris', 'Tokyo', 'New York', 'London', 'Sydney', 'Rome', 'Berlin', 'Moscow', 'Cairo', 'Toronto'];
    const name = placeNames[Math.floor(Math.random() * placeNames.length)];
    const dateVisited = this.getRandomDate();
    const rating = Math.floor(Math.random() * 6);
    return this.create(name, dateVisited, rating);
  }

  startRandomInsertions() {
    if (this.isRunning) return;
    this.isRunning = true;
    const insertBatch = async () => {
      if (!this.isRunning) return;
      await Promise.all(Array(5).fill().map(() => this.insertRandomRecord()));
    };
    this.insertionInterval = setInterval(() => insertBatch().catch(err => console.error('Random insertion error:', err)), 5000);
  }

  stopRandomInsertions() {
    this.isRunning = false;
    if (this.insertionInterval) {
      clearInterval(this.insertionInterval);
      this.insertionInterval = null;
    }
  }
}

export default Service;