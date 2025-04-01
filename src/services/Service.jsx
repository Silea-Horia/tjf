import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/locations';

class Service {
    constructor() {
        this.isRunning = false;
    }

    async getAll() {
        try {
            const response = await axios.get(REST_API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    }

    async create(name, dateVisited, rating) {
        if (!this.validParameters(dateVisited, rating)) return null;
        try {
            const response = await axios.post(REST_API_BASE_URL, { name, dateVisited, rating});
            return response.data; 
        } catch (error) {
            console.error('Error creating location:', error);
            return null;
        }
    }

    validParameters(dateVisited, rating) {
        return this.isValidRating(rating) && this.isValidDate(dateVisited);
    }

    isValidRating(rating) {
        return Number.isInteger(rating) && 0 <= rating && rating <= 5;
    }

    isValidDate(dateVisited) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
    
        if (!regex.test(dateVisited)) {
            return false;
        }
    
        const [year, month, day] = dateVisited.split('-').map(Number);
    
        const date = new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
    
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    }

    async read(id) {
        try {
            const response = await axios.get(`${REST_API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error reading location:', error);
            return null;
        }
    }

    async update(id, newName, newDateVisited, newRating) {
        if (!this.validParameters(newDateVisited, newRating)) return null;
        try {
            const response = await axios.put(`${REST_API_BASE_URL}/${id}`, {
                name: newName,
                dateVisited: newDateVisited,
                rating: newRating
            });
            return response.data;
        } catch (error) {
            console.error('Error updating location:', error);
            return null;
        }
    }

    async delete(id) {
        try {
            await axios.delete(`${REST_API_BASE_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting location:', error);
            return false;
        }
    }

    filter(locations, searchTerm, selectedRatings) {
        return locations.filter(location =>
            this.matchesSearch(location, searchTerm) && this.matchesRating(location, selectedRatings)
        );
    }
    
    matchesSearch(location, searchTerm) {
        return location.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    matchesRating(location, selectedRatings) {
        return selectedRatings.length == 0 || selectedRatings.includes(location.rating);
    }

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
            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(this.insertRandomRecord());
            }
            await Promise.all(promises);
        };

        this.insertionInterval = setInterval(() => {
            insertBatch().catch(err => console.error('Random insertion error:', err));
        }, 5000);
    }

    stopRandomInsertions() {
        this.isRunning = false;
        if (this.insertionInterval) {
            clearInterval(this.insertionInterval);
            this.insertionInterval = null;
        }
    }
};

export default Service;