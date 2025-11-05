import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService.js';
import { City } from '../models/City.js';
import { CONFIG } from '../config/config.js';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const storageService = new StorageService(CONFIG);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    setFavorites(storageService.getFavorites());
  };

  const addFavorite = (cityName, country, coordinates = null) => {
    const city = new City(cityName, country, coordinates);
    storageService.saveFavorite(city);
    loadFavorites();
  };

  const removeFavorite = (cityId) => {
    storageService.removeFavorite(cityId);
    loadFavorites();
  };

  const isFavorite = (cityName, country) => {
    return storageService.isFavorite(cityName, country);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

