// import Repository from '../repo/Repository.jsx'; 
const repository = require('../repo/Repository.jsx');

describe('Repository', () => {
    let repo;
    const initialLocations = [
        { id: 1, name: 'The Eiffel Tower', dateVisited: '2025-08-10', rating: 5 },
        { id: 2, name: 'Sibiu', dateVisited: '2004-01-14', rating: 5 },
    ];
    const newLocation = { name: 'Barcelona', dateVisited: '2024-05-15', rating: 4 };

    beforeEach(() => {
        repo = new repository.Repository([...initialLocations]);
    });

    it('should create a new location', () => {
        const createdLocation = repo.create(newLocation.name, newLocation.dateVisited, newLocation.rating);
        expect(createdLocation).toEqual({ ...newLocation, id: 3 });
        expect(repo.getAll()).toHaveLength(3);
    });

    it('should read a location by ID', () => {
        const location = repo.read(1);
        expect(location).toEqual(initialLocations[0]);
    });

    it('should update a location', () => {
        const updatedLocation = { name: 'Updated Sibiu', dateVisited: '2005-01-14', rating: 5 };
        const result = repo.update(2, updatedLocation.name, updatedLocation.dateVisited, updatedLocation.rating);
        expect(result).toEqual({ ...updatedLocation, id: 2 });
        expect(repo.read(2)).toEqual({ ...updatedLocation, id: 2 });
    });

    it('should delete a location', () => {
        const result = repo.delete(1);
        expect(result).toBe(true);
        expect(repo.getAll()).toHaveLength(1);
        expect(repo.read(1)).toBeUndefined();
    });

    it('should delete all locations', () => {
        let result = repo.delete(initialLocations[0].id);
        expect(result).toBe(true);
        result = repo.delete(initialLocations[1].id);
        expect(result).toBe(true);
        expect(repo.getAll()).toHaveLength(0);
    });

    it('should have an invalid delete', () => {
        let result = repo.delete(initialLocations[0].id);
        result = repo.delete(initialLocations[0].id);
        expect(result).toBe(false);
        result = repo.delete(initialLocations[1].id);
        result = repo.delete(initialLocations[0].id);
        expect(result).toBe(false);
    });

    it('should return all locations', () => {
        expect(repo.getAll()).toEqual(initialLocations);
    });
});