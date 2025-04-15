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
        this.loadQueueFromStorage();
        this.loadOfflineCopyFromStorage();
        this.startServerCheck();
    }

    // State Management
    initListeners(setConnState) {
        this.setConnState = setConnState;
        window.addEventListener('online', () => {
            setConnState('online');
            this.serverDown = false;
            this.pushToServer();
        });
        window.addEventListener('offline', () => setConnState('offline'));
    }

    getState() {
        return this.serverDown ? 'server down' : (window.navigator.onLine ? 'online' : 'offline');
    }

    async checkServerStatus() {
        try {
            await axios.get(`${REST_API_BASE_URL}/health`, { timeout: 2000 });
            if (this.serverDown) {
                this.serverDown = false;
                this.setConnState?.('online');
                this.pushToServer();
            }
        } catch (error) {
            if (!this.serverDown) {
                this.serverDown = true;
                this.setConnState?.('server down');
            }
        }
    }

    startServerCheck() {
        this.checkServerStatus();
        this.serverCheckInterval = setInterval(() => this.checkServerStatus(), 3000);
    }

    stopServerCheck() {
        if (this.serverCheckInterval) {
            clearInterval(this.serverCheckInterval);
            this.serverCheckInterval = null;
        }
    }

    saveQueueToStorage() {
        localStorage.setItem('offlineQueue', JSON.stringify(this.offlineQueue));
    }

    loadQueueFromStorage() {
        const storedQueue = localStorage.getItem('offlineQueue');
        this.offlineQueue = storedQueue ? JSON.parse(storedQueue) : [];
    }

    saveOfflineCopyToStorage() {
        localStorage.setItem('offlineCopy', JSON.stringify(this.offlineCopy));
    }

    loadOfflineCopyFromStorage() {
        const storedCopy = localStorage.getItem('offlineCopy');
        this.offlineCopy = storedCopy ? JSON.parse(storedCopy) : [];
        this.deduplicateOfflineCopy();
    }

    deduplicateOfflineCopy() {
        const seenIds = new Set();
        this.offlineCopy = this.offlineCopy.filter((loc) => {
            if (seenIds.has(loc.id)) {
                console.warn(`Service: Removed duplicate ID ${loc.id} from offlineCopy`);
                return false;
            }
            seenIds.add(loc.id);
            return true;
        });
    }

    async pushToServer() {
        if (this.getState() !== 'online' || this.offlineQueue.length === 0) return;

        const queueCopy = [...this.offlineQueue];
        this.offlineQueue = [];
        this.saveQueueToStorage();

        for (const { action, data } of queueCopy) {
            try {
                if (action === 'create') {
                    const { name, dateVisited, rating } = data;
                    const response = await this.create(name, dateVisited, rating);
                    this.offlineCopy = this.offlineCopy.filter((loc) => loc.name !== name || loc.dateVisited !== dateVisited);
                    this.offlineCopy.push(response);
                    console.log(`Synced create for ${name}`);
                } else if (action === 'update') {
                    const { id, name, dateVisited, rating } = data;
                    await this.update(id, name, dateVisited, rating);
                    console.log(`Synced update for ${id}`);
                } else if (action === 'delete') {
                    const id = data;
                    await this.delete(id);
                    console.log(`Synced delete for ${id}`);
                }
            } catch (error) {
                console.error(`Failed to sync ${action}:`, error);
                this.offlineQueue.push({ action, data });
            }
        }
        this.saveQueueToStorage();
        this.saveOfflineCopyToStorage();
        this.deduplicateOfflineCopy();
    }

    // CRUD Operations
    async getAll(searchTerm = '', ratings = [], page = 1) {
        if (this.getState() === 'offline' || this.getState() === 'server down') {
            return this.getOfflinePage(page, searchTerm, ratings);
        }

        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('name', searchTerm);
            ratings.forEach((rating) => params.append('ratings', rating));
            params.append('page', page - 1);

            const response = await axios.get(`${REST_API_BASE_URL}?${params.toString()}`);

            this.serverDown = false;
            this.setConnState?.('online');
            await this.pushToServer();

            const newContent = response.data.content || [];
            if (page === 1) {
                this.offlineCopy = newContent;
            } else {
                const existingIds = new Set(this.offlineCopy.map((loc) => loc.id));
                this.offlineCopy = [...this.offlineCopy, ...newContent.filter((loc) => !existingIds.has(loc.id))];
            }
            this.saveOfflineCopyToStorage();
            this.deduplicateOfflineCopy();

            return {
                content: newContent,
                totalPages: response.data.totalPages || 1,
                page: page,
            };
        } catch (error) {
            console.error('Error fetching locations:', error.message, error.response?.data);
            this.serverDown = true;
            this.setConnState?.('server down');
            return this.getOfflinePage(page, searchTerm, ratings);
        }
    }

    getOfflinePage(page, searchTerm = '', ratings = []) {
        const pageSize = 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        let filteredCopy = this.offlineCopy;
        if (searchTerm) {
            filteredCopy = filteredCopy.filter((loc) =>
                loc.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (ratings.length > 0) {
            filteredCopy = filteredCopy.filter((loc) => ratings.includes(loc.rating));
        }

        console.log('Service: getOfflinePage', {
            page,
            startIndex,
            endIndex,
            offlineCopyLength: this.offlineCopy.length,
            filteredCopyLength: filteredCopy.length,
        });

        return {
            content: filteredCopy.slice(startIndex, endIndex),
            totalPages: Math.ceil(filteredCopy.length / pageSize) || 1,
            page: page,
        };
    }

    async read(id) {
        console.log('Service: read called', {
            id,
            state: this.getState(),
            offlineCopyIds: this.offlineCopy.map((loc) => loc.id),
        });

        const parsedId = Number(id);

        if (this.getState() === 'online') {
            try {
                const response = await axios.get(`${REST_API_BASE_URL}/${parsedId}`);
                console.log('Service: read success', { id: parsedId, data: response.data });
                this.offlineCopy = [
                    ...this.offlineCopy.filter((loc) => loc.id !== parsedId),
                    response.data,
                ];
                this.saveOfflineCopyToStorage();
                this.deduplicateOfflineCopy();
                return response.data;
            } catch (error) {
                console.error('Service: read error, falling back to offlineCopy', error.message);
                this.serverDown = true;
                this.setConnState?.('server down');
            }
        }

        const foundLocation = this.offlineCopy.find((location) => location.id === parsedId) || null;
        console.log('Service: read offline result', { id: parsedId, foundLocation });
        return foundLocation;
    }

    async create(name, dateVisited, rating) {
        if (this.getState() === 'online') {
            try {
                const response = await axios.post(REST_API_BASE_URL, { name, dateVisited, rating });
                this.offlineCopy = [...this.offlineCopy, response.data];
                this.saveOfflineCopyToStorage();
                this.deduplicateOfflineCopy();
                return response.data;
            } catch (error) {
                console.error('Error creating location:', error.message);
                this.serverDown = true;
                this.setConnState?.('server down');
            }
        }

        const tempId =
            this.offlineCopy.length > 0 ? Math.max(...this.offlineCopy.map((loc) => loc.id)) + 1 : 1;
        const location = { id: tempId, name, dateVisited, rating };
        this.offlineQueue.push({ action: 'create', data: { name, dateVisited, rating } });
        this.offlineCopy.push(location);
        this.saveQueueToStorage();
        this.saveOfflineCopyToStorage();
        this.deduplicateOfflineCopy();
        return location;
    }

    async update(id, name, dateVisited, rating) {
        const parsedId = Number(id);
        if (this.getState() === 'online') {
            try {
                const response = await axios.put(`${REST_API_BASE_URL}/${parsedId}`, {
                    name,
                    dateVisited,
                    rating,
                });
                this.offlineCopy = this.offlineCopy.map((loc) =>
                    loc.id === parsedId ? { ...loc, name, dateVisited, rating } : loc
                );
                this.saveOfflineCopyToStorage();
                this.deduplicateOfflineCopy();
                return response.data;
            } catch (error) {
                console.error('Error updating location:', error.message);
                this.serverDown = true;
                this.setConnState?.('server down');
            }
        }

        const location = { id: parsedId, name, dateVisited, rating };
        this.offlineQueue.push({ action: 'update', data: location });
        this.offlineCopy = this.offlineCopy.map((loc) =>
            loc.id === parsedId ? location : loc
        );
        this.saveQueueToStorage();
        this.saveOfflineCopyToStorage();
        this.deduplicateOfflineCopy();
        return location;
    }

    async delete(id) {
        const parsedId = Number(id);
        if (this.getState() === 'online') {
            try {
                await axios.delete(`${REST_API_BASE_URL}/${parsedId}`);
                this.offlineCopy = this.offlineCopy.filter((loc) => loc.id !== parsedId);
                this.saveOfflineCopyToStorage();
                this.deduplicateOfflineCopy();
                return true;
            } catch (error) {
                console.error('Error deleting location:', error.message);
                this.serverDown = true;
                this.setConnState?.('server down');
            }
        }

        this.offlineQueue.push({ action: 'delete', data: parsedId });
        this.offlineCopy = this.offlineCopy.filter((loc) => loc.id !== parsedId);
        this.saveQueueToStorage();
        this.saveOfflineCopyToStorage();
        this.deduplicateOfflineCopy();
        return true;
    }

    getRandomDate() {
        const year = Math.floor(Math.random() * (2025 - 2000 + 1)) + 2000;
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async insertRandomRecord() {
        const placeNames = [
            'Paris',
            'Tokyo',
            'New York',
            'London',
            'Sydney',
            'Rome',
            'Berlin',
            'Moscow',
            'Cairo',
            'Toronto',
        ];
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
        this.insertionInterval = setInterval(
            () => insertBatch().catch((err) => console.error('Random insertion error:', err)),
            5000
        );
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