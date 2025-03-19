// import Repository from '../repo/Repository.jsx'; 
const service = require('../services/Service.jsx');
const repository = require('../repo/Repository.jsx');

describe('Service', () => {
    let serv;
    let repo;
    const initialLocations = [
        { id: 1, name: 'The Eiffel Tower', dateVisited: '2025-08-10', rating: 5 },
        { id: 2, name: 'Sibiu', dateVisited: '2004-01-14', rating: 5 },
    ];
    const newLocation = { name: 'Barcelona', dateVisited: '2024-05-15', rating: 4 };

    beforeEach(() => {
        repo = new repository.Repository([...initialLocations]);
        serv = new service.Service(repo);
    });

    it('should get all locations', () => {
        const result = serv.getAll();
        expect(result).toEqual(initialLocations);
    });

    it('should create a new valid location', () => {
        const createdLocation = serv.create(newLocation.name, newLocation.dateVisited, newLocation.rating);
        expect(createdLocation).toEqual({ ...newLocation, id: 3 });
        expect(serv.getAll()).toHaveLength(3);
    });

    it('should not accept invalid rating', () => {
        const createdLocation = serv.create(newLocation.name, newLocation.dateVisited, "a");
        expect(createdLocation).toEqual(null);
    })

    it('should not accept invalid date', () => {
        let createdLocation = serv.create(newLocation.name, "2025-13-01", newLocation.rating);
        expect(createdLocation).toEqual(null);
        createdLocation = serv.create(newLocation.name, "202512--01", newLocation.rating);
        expect(createdLocation).toEqual(null);
    })

    it('should read a location by ID', () => {
        const location = serv.read(1);
        expect(location).toEqual(initialLocations[0]);
    });

    it('should update a location', () => {
        const updatedLocation = { name: 'Updated Sibiu', dateVisited: '2005-01-14', rating: 5 };
        const result = serv.update(2, updatedLocation.name, updatedLocation.dateVisited, updatedLocation.rating);
        expect(result).toEqual({ ...updatedLocation, id: 2 });
        expect(serv.read(2)).toEqual({ ...updatedLocation, id: 2 });
    });

    it('should delete a location', () => {
        const result = serv.delete(1);
        expect(result).toBe(true);
        expect(serv.getAll()).toHaveLength(1);
        expect(serv.read(1)).toBeUndefined();
    });

    it('should delete all locations', () => {
        let result = serv.delete(initialLocations[0].id);
        expect(result).toBe(true);
        result = serv.delete(initialLocations[1].id);
        expect(result).toBe(true);
        expect(serv.getAll()).toHaveLength(0);
    });

    it('should have an invalid delete', () => {
        let result = serv.delete(initialLocations[0].id);
        result = serv.delete(initialLocations[0].id);
        expect(result).toBe(false);
        result = serv.delete(initialLocations[1].id);
        result = serv.delete(initialLocations[0].id);
        expect(result).toBe(false);
    });

    it('should filter by one rating', () => {
        let result = serv.filter("", [5]);
        expect(result).toHaveLength(2);
        result = serv.filter("", [3]);
        expect(result).toHaveLength(0);
    });

    it('should filter by multiple ratings', () => {
        let result = serv.filter("", [3, 5]);
        expect(result).toHaveLength(2);
        result = serv.filter("", [2,3]);
        expect(result).toHaveLength(0);
    });

    it('should filter by name', () => {
        let result = serv.filter("", []);
        expect(result).toHaveLength(2);
        result = serv.filter("S", []);
        expect(result).toHaveLength(1);
        result = serv.filter("Sibi", []);
        expect(result).toHaveLength(1);
    });

    it('should filter by name and rating', () => {
        result = serv.filter("S", [5]);
        expect(result).toHaveLength(1);
        result = serv.filter("Sibi", [4]);
        expect(result).toHaveLength(0);
        result = serv.filter("XX", [5]);
        expect(result).toHaveLength(0);
    });
});