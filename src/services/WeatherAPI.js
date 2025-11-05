/**
 * Servicio para interactuar con la API de OpenWeatherMap
 * Usa la API tradicional que funciona sin suscripción
 */
export class WeatherAPI {
  constructor(config) {
    this.baseURL = config.API.BASE_URL;
    this.apiKey = config.API.API_KEY;
    this.units = config.API.UNITS;
    this.lang = config.API.LANG;
  }

  /**
   * Obtiene el clima actual usando la API tradicional
   * @param {string} cityName - Nombre de la ciudad
   * @returns {Promise<Object>} Datos del clima
   */
  async getCurrentWeather(cityName) {
    try {
      const url = `${this.baseURL}/weather?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=${this.units}&lang=${this.lang}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 404) {
          throw new Error(`Ciudad "${cityName}" no encontrada. Intenta con otro nombre.`);
        }
        if (response.status === 401) {
          throw new Error('API Key inválida. Verifica tu configuración.');
        }
        if (response.status === 429) {
          throw new Error('Límite de peticiones excedido. Intenta más tarde.');
        }
        throw new Error(errorData.message || 'Error al obtener datos del clima');
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica tu internet.');
      }
      throw error;
    }
  }

  /**
   * Obtiene el pronóstico de 5 días usando la API tradicional
   */
  async getForecast(cityName) {
    try {
      const url = `${this.baseURL}/forecast?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=${this.units}&lang=${this.lang}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al obtener pronóstico');
      }

      const data = await response.json();
      return this.processForecastData(data.list);
    } catch (error) {
      throw new Error(`Error al obtener pronóstico: ${error.message}`);
    }
  }

  /**
   * Obtiene clima por coordenadas usando la API tradicional
   */
  async getWeatherByCoords(lat, lon) {
    try {
      const url = `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.units}&lang=${this.lang}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al obtener datos del clima por ubicación');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error al obtener clima: ${error.message}`);
    }
  }

  /**
   * Obtiene pronóstico por coordenadas usando la API tradicional
   */
  async getForecastByCoords(lat, lon) {
    try {
      const url = `${this.baseURL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.units}&lang=${this.lang}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al obtener pronóstico por ubicación');
      }

      const data = await response.json();
      return this.processForecastData(data.list);
    } catch (error) {
      throw new Error(`Error al obtener pronóstico: ${error.message}`);
    }
  }

  processForecastData(list) {
    const dailyForecasts = {};
    
    list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date: date,
          items: [],
          min: Infinity,
          max: -Infinity
        };
      }
      
      dailyForecasts[dateKey].items.push(item);
      const temp = item.main?.temp || item.temp?.day || item.temp;
      dailyForecasts[dateKey].min = Math.min(dailyForecasts[dateKey].min, temp);
      dailyForecasts[dateKey].max = Math.max(dailyForecasts[dateKey].max, temp);
    });

    return Object.values(dailyForecasts)
      .slice(0, 5)
      .map(day => ({
        dt: Math.floor(day.date.getTime() / 1000),
        temp: { min: day.min, max: day.max },
        weather: day.items[Math.floor(day.items.length / 2)].weather,
        humidity: day.items[Math.floor(day.items.length / 2)].main?.humidity || day.items[Math.floor(day.items.length / 2)].humidity,
        wind: day.items[Math.floor(day.items.length / 2)].wind,
        rain: day.items.find(item => item.rain)?.rain || null,
        pop: day.items.reduce((sum, item) => sum + (item.pop || 0), 0) / day.items.length,
        clouds: day.items[Math.floor(day.items.length / 2)].clouds?.all || day.items[Math.floor(day.items.length / 2)].clouds
      }));
  }
}

