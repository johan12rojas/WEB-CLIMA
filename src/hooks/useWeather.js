import { useState, useEffect } from 'react';
import { WeatherAPI } from '../services/WeatherAPI.js';
import { Weather } from '../models/Weather.js';
import { Forecast } from '../models/Forecast.js';
import { CONFIG } from '../config/config.js';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherAPI = new WeatherAPI(CONFIG);

  const searchWeather = async (cityName) => {
    if (!cityName || cityName.trim() === '') return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Usar directamente la API tradicional (funciona sin suscripción)
      const currentData = await weatherAPI.getCurrentWeather(cityName);
      setWeather(new Weather(currentData));
      
      try {
        const forecastData = await weatherAPI.getForecast(cityName);
        setForecast(forecastData.map(item => new Forecast(item)));
      } catch (forecastErr) {
        setForecast([]);
      }
    } catch (err) {
      setError(err.message || 'Error desconocido al buscar el clima');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const searchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar directamente la API tradicional con coordenadas
      const [currentData, forecastData] = await Promise.all([
        weatherAPI.getWeatherByCoords(lat, lon),
        weatherAPI.getForecastByCoords(lat, lon)
      ]);
      
      setWeather(new Weather(currentData));
      setForecast(forecastData.map(item => new Forecast(item)));
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  return { weather, forecast, loading, error, searchWeather, searchWeatherByCoords };
}

