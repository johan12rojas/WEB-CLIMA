/**
 * Modelo de datos para el clima actual
 */
export class Weather {
  constructor(data) {
    this.city = data.name;
    this.country = data.sys?.country || '';
    this.temperature = Math.round(data.main?.temp || 0);
    this.feelsLike = Math.round(data.main?.feels_like || 0);
    this.description = data.weather?.[0]?.description || '';
    this.icon = data.weather?.[0]?.icon || '';
    this.weatherId = data.weather?.[0]?.id || null;
    this.main = data.weather?.[0]?.main || '';
    this.humidity = data.main?.humidity || 0;
    this.windSpeed = data.wind?.speed || 0;
    this.pressure = data.main?.pressure || 0;
    this.visibility = data.visibility ? (data.visibility / 1000).toFixed(1) : 0;
    this.clouds = data.clouds?.all || 0;
    this.sunrise = data.sys?.sunrise ? new Date(data.sys.sunrise * 1000) : null;
    this.sunset = data.sys?.sunset ? new Date(data.sys.sunset * 1000) : null;
    this.coordinates = {
      lat: data.coord?.lat || 0,
      lon: data.coord?.lon || 0
    };
    this.timestamp = new Date();
  }

  getIconUrl() {
    return `https://openweathermap.org/img/wn/${this.icon}@2x.png`;
  }

  getFormattedTime(date) {
    if (!date) return '';
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}

