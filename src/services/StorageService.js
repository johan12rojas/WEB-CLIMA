import { City } from '../models/City.js';

/**
 * Servicio para manejar el almacenamiento local
 */
export class StorageService {
  constructor(config) {
    this.favoritesKey = config.STORAGE.FAVORITES_KEY;
    this.historyKey = config.STORAGE.HISTORY_KEY;
    this.maxHistory = config.STORAGE.MAX_HISTORY;
  }

  saveFavorite(city) {
    const favorites = this.getFavorites();
    
    if (!favorites.some(fav => fav.name.toLowerCase() === city.name.toLowerCase() && fav.country === city.country)) {
      favorites.push(city.toJSON());
      localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    }
  }

  getFavorites() {
    const stored = localStorage.getItem(this.favoritesKey);
    if (!stored) return [];
    
    try {
      const data = JSON.parse(stored);
      return data.map(item => City.fromJSON(item));
    } catch (error) {
      console.error('Error al leer favoritos:', error);
      return [];
    }
  }

  removeFavorite(cityId) {
    const favorites = this.getFavorites();
    const filtered = favorites.filter(fav => fav.id !== cityId);
    localStorage.setItem(this.favoritesKey, JSON.stringify(filtered.map(f => f.toJSON())));
  }

  isFavorite(cityName, country) {
    const favorites = this.getFavorites();
    return favorites.some(
      fav => fav.name.toLowerCase() === cityName.toLowerCase() && fav.country === country
    );
  }

  saveToHistory(cityName, country) {
    const history = this.getHistory();
    
    const filtered = history.filter(
      item => !(item.name.toLowerCase() === cityName.toLowerCase() && item.country === country)
    );
    
    filtered.unshift({
      name: cityName,
      country: country,
      timestamp: new Date().toISOString()
    });
    
    const limited = filtered.slice(0, this.maxHistory);
    localStorage.setItem(this.historyKey, JSON.stringify(limited));
  }

  getHistory() {
    const stored = localStorage.getItem(this.historyKey);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error al leer historial:', error);
      return [];
    }
  }
}

