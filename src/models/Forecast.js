/**
 * Modelo de datos para el pronóstico extendido
 */
export class Forecast {
  constructor(data) {
    this.date = new Date(data.dt * 1000);
    this.temperature = {
      min: Math.round(data.temp?.min || data.main?.temp_min || 0),
      max: Math.round(data.temp?.max || data.main?.temp_max || 0),
      day: Math.round(data.temp?.day || data.main?.temp || 0),
      night: Math.round(data.temp?.night || data.main?.temp || 0)
    };
    this.description = data.weather?.[0]?.description || '';
    this.icon = data.weather?.[0]?.icon || '';
    this.humidity = data.humidity || data.main?.humidity || 0;
    this.windSpeed = data.wind?.speed || data.speed || 0;
    this.precipitation = data.rain ? Object.values(data.rain)[0] : (data.pop || 0) * 100;
    this.clouds = data.clouds || 0;
  }

  getIconUrl() {
    return `https://openweathermap.org/img/wn/${this.icon}@2x.png`;
  }

  getDayName() {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = new Date().getDay();
    const dayIndex = this.date.getDay();
    
    if (dayIndex === today) return 'Hoy';
    if (dayIndex === (today + 1) % 7) return 'Mañana';
    return days[dayIndex];
  }

  getFormattedDate() {
    return this.date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  }
}

