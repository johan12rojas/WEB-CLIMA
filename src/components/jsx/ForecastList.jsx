import '../css/ForecastList.css';

export function ForecastList({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="forecast-container">
      <h3 className="section-title">Pronóstico</h3>
      <div className="forecast-list">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-day-info">
              <span className="forecast-day">{day.getDayName()}</span>
              <span className="forecast-date">{day.getFormattedDate()}</span>
            </div>
            <div className="forecast-weather">
              <img 
                src={day.getIconUrl()} 
                alt={day.description}
                className="forecast-icon"
              />
              <span className="forecast-desc">
                {day.description.charAt(0).toUpperCase() + day.description.slice(1)}
              </span>
            </div>
            <div className="forecast-temps">
              <span className="temp-max">{day.temperature.max}°</span>
              <span className="temp-min">{day.temperature.min}°</span>
            </div>
            <div className="forecast-precipitation">
              {day.precipitation > 0 && (
                <span className="precip-value">💧 {day.precipitation.toFixed(0)}%</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

