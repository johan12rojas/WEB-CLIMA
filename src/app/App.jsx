import { useState, useEffect } from 'react';
import { useWeather } from '../hooks/useWeather.js';
import { useFavorites } from '../hooks/useFavorites.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { StorageService } from '../services/StorageService.js';
import { CONFIG } from '../config/config.js';
import { SearchBar } from '../components/jsx/SearchBar.jsx';
import { WeatherCard } from '../components/jsx/WeatherCard.jsx';
import { ForecastList } from '../components/jsx/ForecastList.jsx';
import { FavoritesList } from '../components/jsx/FavoritesList.jsx';
import { HistoryList } from '../components/jsx/HistoryList.jsx';
import { Clock } from '../components/jsx/Clock.jsx';
import { WeatherVideoBackground } from '../components/jsx/WeatherVideoBackground.jsx';
import { LoadingSpinner } from '../components/jsx/LoadingSpinner.jsx';
import { ErrorMessage } from '../components/jsx/ErrorMessage.jsx';
import './App.css';

function App() {
  const { weather, forecast, loading, error, searchWeather, searchWeatherByCoords } = useWeather();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { location, error: geoError, loading: geoLoading } = useGeolocation();
  const [errorMessage, setErrorMessage] = useState(null);
  const [backgroundTheme, setBackgroundTheme] = useState('');
  const storageService = new StorageService(CONFIG);

  // Geolocalización automática al cargar
  useEffect(() => {
    if (location && !weather && !geoLoading) {
      searchWeatherByCoords(location.lat, location.lon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Cargar primera ciudad favorita si no hay ubicación
  useEffect(() => {
    if (!location && !geoError && favorites.length > 0 && !weather && !geoLoading) {
      searchWeather(favorites[0].name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, geoError, favorites]);

  useEffect(() => {
    // Priorizar errores de búsqueda sobre errores de geolocalización
    if (error) {
      setErrorMessage(error);
    } else if (geoError && !weather) {
      // Solo mostrar error de geolocalización si no hay clima cargado
      setErrorMessage(`Geolocalización: ${geoError}`);
    }
  }, [error, geoError, weather]);

  // Actualizar fondo según el clima
  useEffect(() => {
    if (weather) {
      const desc = weather.description.toLowerCase();
      const hour = new Date().getHours();
      const isDay = hour >= 6 && hour < 20;

      // Detectar tormenta primero (más específico)
      if (desc.includes('tormenta') || desc.includes('thunderstorm')) {
        setBackgroundTheme('weather-storm');
      } else if (desc.includes('lluvia') || desc.includes('lluvioso') || desc.includes('rain')) {
        setBackgroundTheme('weather-rainy');
      } else if (desc.includes('nieve')) {
        setBackgroundTheme('weather-snowy');
      } else if (desc.includes('nublado') || desc.includes('cloud')) {
        setBackgroundTheme('weather-cloudy');
      } else if (desc.includes('soleado') || desc.includes('despejado') || desc.includes('clear')) {
        setBackgroundTheme(isDay ? 'weather-sunny' : 'weather-clear-night');
      } else {
        setBackgroundTheme(isDay ? 'weather-default-day' : 'weather-default-night');
      }
    }
  }, [weather]);

  const handleSearch = async (cityName) => {
    setErrorMessage(null);
    try {
      await searchWeather(cityName);
    } catch (err) {
      console.error('Error en handleSearch:', err);
      setErrorMessage(err.message || 'Error al buscar ciudad');
    }
  };

  // Guardar en historial cuando el clima se actualiza
  useEffect(() => {
    if (weather) {
      storageService.saveToHistory(weather.city, weather.country);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather]);

  const handleToggleFavorite = () => {
    if (!weather) return;

    const favorite = isFavorite(weather.city, weather.country);
    
    if (favorite) {
      const city = favorites.find(
        f => f.name.toLowerCase() === weather.city.toLowerCase() &&
             f.country === weather.country
      );
      if (city) {
        removeFavorite(city.id);
      }
    } else {
      addFavorite(weather.city, weather.country, weather.coordinates);
    }
  };

  const handleSelectFavorite = (cityName) => {
    searchWeather(cityName);
  };

  const handleRemoveFavorite = (cityId) => {
    removeFavorite(cityId);
  };

  return (
    <div className="app">
      <WeatherVideoBackground weather={weather} />
      <div className={`app-background ${backgroundTheme}`}></div>
      <div className="app-content">
        <header className="app-header">
          <h1 className="app-title">WEB CLIMA FROM SEBASTIAN</h1>
        </header>

        <div className="search-time-container">
          <div className="search-bar-wrapper">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
          <Clock />
        </div>

        {errorMessage && (
          <ErrorMessage 
            message={errorMessage} 
            onClose={() => setErrorMessage(null)}
          />
        )}

        {weather && (
          <>
            <WeatherCard
              weather={weather}
              isFavorite={isFavorite(weather.city, weather.country)}
              onToggleFavorite={handleToggleFavorite}
            />
            <ForecastList forecast={forecast} />
            <FavoritesList
              favorites={favorites}
              onSelectCity={handleSelectFavorite}
              onRemoveFavorite={handleRemoveFavorite}
            />
          </>
        )}

        <div className="bottom-section">
          <HistoryList onSelectCity={handleSelectFavorite} />
        </div>

        {!weather && !loading && !geoLoading && (
          <div className="welcome-message">
            <div className="welcome-icon">🌤️</div>
            <h2>Busca el clima de cualquier ciudad</h2>
            <p>Escribe el nombre de una ciudad en el buscador</p>
          </div>
        )}
      </div>

      {loading && <LoadingSpinner />}
    </div>
  );
}

export default App;

