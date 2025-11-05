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
      // Paso 1: Convertir nombre de ciudad a coordenadas usando Geocoding API
      const location = await weatherAPI.geocodeCity(cityName);
      
      // Paso 2: Obtener clima usando One Call API 3.0 con las coordenadas
      const oneCallData = await weatherAPI.getOneCallWeather(location.lat, location.lon);
      
      if (oneCallData) {
        // Convertir datos de One Call a formato tradicional
        const currentData = weatherAPI.convertOneCallToTraditional(oneCallData);
        // Actualizar nombre de ciudad desde geocoding
        currentData.name = location.name;
        currentData.sys = currentData.sys || {};
        currentData.sys.country = location.country;
        
        setWeather(new Weather(currentData));
        
        // Procesar pronóstico diario de One Call API
        if (oneCallData.daily && oneCallData.daily.length > 0) {
          const forecastData = oneCallData.daily.slice(0, 5).map(day => ({
            dt: day.dt,
            temp: day.temp,
            weather: day.weather,
            humidity: day.humidity,
            wind: { speed: day.wind_speed },
            rain: day.rain ? { '1h': day.rain } : null,
            pop: day.pop,
            clouds: day.clouds
          }));
          setForecast(forecastData.map(item => new Forecast(item)));
        } else {
          setForecast([]);
        }
      } else {
        // Fallback a API tradicional si One Call no está disponible
        const currentData = await weatherAPI.getCurrentWeather(cityName);
        setWeather(new Weather(currentData));
        
        try {
          const forecastData = await weatherAPI.getForecast(cityName);
          setForecast(forecastData.map(item => new Forecast(item)));
        } catch (forecastErr) {
          setForecast([]);
        }
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
      // Intentar usar One Call API 3.0 primero
      const oneCallData = await weatherAPI.getOneCallWeather(lat, lon);
      
      if (oneCallData) {
        // Convertir datos de One Call a formato tradicional
        const currentData = weatherAPI.convertOneCallToTraditional(oneCallData);
        setWeather(new Weather(currentData));
        
        // Procesar pronóstico diario
        if (oneCallData.daily && oneCallData.daily.length > 0) {
          const forecastData = oneCallData.daily.slice(0, 5).map(day => ({
            dt: day.dt,
            temp: day.temp,
            weather: day.weather,
            humidity: day.humidity,
            wind: { speed: day.wind_speed },
            rain: day.rain ? { '1h': day.rain } : null,
            pop: day.pop,
            clouds: day.clouds
          }));
          setForecast(forecastData.map(item => new Forecast(item)));
        } else {
          setForecast([]);
        }
      } else {
        // Fallback a API tradicional
        const [currentData, forecastData] = await Promise.all([
          weatherAPI.getWeatherByCoords(lat, lon),
          weatherAPI.getForecastByCoords(lat, lon)
        ]);
        
        setWeather(new Weather(currentData));
        setForecast(forecastData.map(item => new Forecast(item)));
      }
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

