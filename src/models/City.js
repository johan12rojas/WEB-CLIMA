/**
 * Modelo de datos para una ciudad
 */
export class City {
  constructor(name, country = '', coordinates = null) {
    this.name = name;
    this.country = country;
    this.coordinates = coordinates;
    this.id = this.generateId();
    this.createdAt = new Date();
  }

  generateId() {
    return `${this.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  }

  getFullName() {
    return this.country ? `${this.name}, ${this.country}` : this.name;
  }

  toJSON() {
    return {
      name: this.name,
      country: this.country,
      coordinates: this.coordinates,
      id: this.id,
      createdAt: this.createdAt.toISOString()
    };
  }

  static fromJSON(data) {
    const city = new City(data.name, data.country, data.coordinates);
    city.id = data.id;
    city.createdAt = new Date(data.createdAt);
    return city;
  }
}

