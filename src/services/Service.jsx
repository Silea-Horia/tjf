import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/locations';

class Service {
  constructor() {
    this.isRunning = false;
    this.insertionInterval = null;
  }

  // CRUD Operations
  async getAll(searchTerm = '', ratings = []) {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('name', searchTerm);
      ratings.forEach(rating => params.append('ratings', rating));
      const response = await axios.get(`${REST_API_BASE_URL}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error.message, error.response?.data);
      throw error;
    }
  }

  async create(name, dateVisited, rating) {
    try {
      const response = await axios.post(REST_API_BASE_URL, { name, dateVisited, rating });
      return response.data;
    } catch (error) {
      console.error('Error creating location:', error.message);
      throw error;
    }
  }

  async read(id) {
    try {
      const response = await axios.get(`${REST_API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error reading location:', error.message);
      return null;
    }
  }

  async update(id, name, dateVisited, rating) {
    try {
      const response = await axios.put(`${REST_API_BASE_URL}/${id}`, { name, dateVisited, rating });
      return response.data;
    } catch (error) {
      console.error('Error updating location:', error.message);
      throw null;
    }
  }

  async delete(id) {
    try {
      await axios.delete(`${REST_API_BASE_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting location:', error.message);
      return false;
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