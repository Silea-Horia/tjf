class Repository {
  constructor(initialData) {
    this.locations = initialData;
    this.nextId = Math.max(...initialData.map(loc => loc.id)) + 1;
  }

  create(name, dateVisited, rating) {
    const newLocation = {name: name, dateVisited: dateVisited, rating: rating, id: this.nextId++};
    this.locations.push(newLocation);
    return newLocation;
  }

  read(id) {
    return this.locations.find(loc => loc.id === id);
  }

  update(id, newName, newDateVisited, newRating) {
    const updatedLocation = {name: newName, dateVisited: newDateVisited, rating: newRating};
    const index = this.findIndex(id);
    if (index > -1) {
      this.locations[index] = {...updatedLocation, id: id};
      return this.locations[index];
    }
    return null;
  }

  findIndex(id) {
    return this.locations.findIndex(location => location.id === id);
  }

  delete(id) {
    const index = this.findIndex(id);
    if (index > -1) {
      this.locations.splice(index, 1);
      return true;
    }
    return false;
  }

  getAll() {
    return [...this.locations];
  }
}

export default Repository;