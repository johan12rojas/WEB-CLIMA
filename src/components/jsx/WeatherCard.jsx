import '../css/WeatherCard.css';

export function WeatherCard({ weather, isFavorite, onToggleFavorite }) {
  if (!weather) return null;

  const getWeatherTheme = () => {
    const desc = weather.description.toLowerCase();
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 20;

    // Detectar tormenta primero (más específico)
    if (desc.includes('tormenta') || desc.includes('thunderstorm')) return 'storm';
    if (desc.includes('lluvia') || desc.includes('lluvioso') || desc.includes('rain')) return 'rainy';
    if (desc.includes('nieve')) return 'snowy';
    if (desc.includes('nublado') || desc.includes('cloud')) return 'cloudy';
    if (desc.includes('soleado') || desc.includes('despejado') || desc.includes('clear')) {
      return isDay ? 'sunny' : 'clear-night';
    }
    return isDay ? 'default-day' : 'default-night';
  };

  const theme = getWeatherTheme();

  return (
    <div className={`weather-card theme-${theme}`}>
      <div className="weather-header">
        <div className="location-info">
          <h2 className="city-name">{weather.city}</h2>
          <p className="country-name">{weather.country}</p>
        </div>
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="weather-main">
        <div className="temperature-section">
          <div className="temperature-value">{weather.temperature}°</div>
          <div className="temperature-feels">
            Sensación {weather.feelsLike}°
          </div>
        </div>
        <div className="weather-icon-section">
          <img 
            src={weather.getIconUrl()} 
            alt={weather.description}
            className="weather-icon-large"
          />
          <p className="weather-description">
            {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
          </p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-row">
          <div className="detail-item">
            <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
            <div className="detail-content">
              <span className="detail-label">Humedad</span>
              <span className="detail-value">{weather.humidity}%</span>
            </div>
          </div>
          <div className="detail-item">
            <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
            </svg>
            <div className="detail-content">
              <span className="detail-label">Viento</span>
              <span className="detail-value">{(weather.windSpeed * 3.6).toFixed(1)} km/h</span>
            </div>
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-item">
            <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M4 12h16M6 8h12M6 16h12"/>
            </svg>
            <div className="detail-content">
              <span className="detail-label">Presión</span>
              <span className="detail-value">{weather.pressure} hPa</span>
            </div>
          </div>
          <div className="detail-item">
            <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4m0 6v4M5.64 5.64l2.83 2.83m4.24 4.24l2.83 2.83M1 12h4m6 0h4M5.64 18.36l2.83-2.83m4.24-4.24l2.83-2.83"/>
            </svg>
            <div className="detail-content">
              <span className="detail-label">Visibilidad</span>
              <span className="detail-value">{weather.visibility} km</span>
            </div>
          </div>
        </div>
        {(weather.sunrise || weather.sunset) && (
          <div className="detail-row">
            {weather.sunrise && (
              <div className="detail-item">
                <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4m0 6v4M4.93 4.93l2.83 2.83m4.24 4.24l2.83 2.83M2 12h4m6 0h4M4.93 19.07l2.83-2.83m4.24-4.24l2.83-2.83"/>
                  <path d="M12 2a10 10 0 1 0 0 20" strokeDasharray="2 2"/>
                </svg>
                <div className="detail-content">
                  <span className="detail-label">Amanecer</span>
                  <span className="detail-value">{weather.getFormattedTime(weather.sunrise)}</span>
                </div>
              </div>
            )}
            {weather.sunset && (
              <div className="detail-item">
                <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4m0 6v4M4.93 4.93l2.83 2.83m4.24 4.24l2.83 2.83M2 12h4m6 0h4M4.93 19.07l2.83-2.83m4.24-4.24l2.83-2.83"/>
                  <path d="M12 2a10 10 0 0 0 0 20" strokeDasharray="2 2"/>
                  <path d="M12 2a10 10 0 0 1 0 20" strokeDasharray="1 1" opacity="0.5"/>
                </svg>
                <div className="detail-content">
                  <span className="detail-label">Atardecer</span>
                  <span className="detail-value">{weather.getFormattedTime(weather.sunset)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

