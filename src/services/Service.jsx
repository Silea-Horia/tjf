class Service {
    constructor(Repository) {
        this.repo = Repository;
        this.isRunning = false;
    }

    getAll() {
        return this.repo.getAll();
    }

    create(name, dateVisited, rating) {
        if(!this.validParameters(dateVisited, rating)) return null;
        const newLocation = this.repo.create(name, dateVisited, rating);
        return newLocation;
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

    read(id) {
        return this.repo.read(id);
    }

    update(id, newName, newDateVisited, newRating) {
        if(!this.validParameters(newDateVisited, newRating)) return null;
        return this.repo.update(id, newName, newDateVisited, newRating);
    }

    delete(id) {
        return this.repo.delete(id);
    }

    filter(searchTerm, selectedRatings) {
        return this.getAll().filter(location =>
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