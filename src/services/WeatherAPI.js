/**
 * Servicio para interactuar con la API de OpenWeatherMap
 * Usa One Call API 3.0 cuando está disponible
 */
export class WeatherAPI {
  constructor(config) {
    this.baseURL = config.API.BASE_URL;
    this.oneCallURL = config.API.ONE_CALL_BASE_URL;
    this.geocodingURL = config.API.GEOCODING_BASE_URL;
    this.apiKey = config.API.API_KEY;
    this.units = config.API.UNITS;
    this.lang = config.API.LANG;
    this.useOneCall = config.API.USE_ONE_CALL !== false;
  }

  /**
   * Convierte un nombre de ciudad a coordenadas usando Geocoding API
   * @param {string} cityName - Nombre de la ciudad
   * @returns {Promise<{lat: number, lon: number, name: string, country: string}>}
   */
  async geocodeCity(cityName) {
    try {
      const url = `${this.geocodingURL}?q=${encodeURIComponent(cityName)}&limit=1&appid=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al buscar coordenadas de la ciudad');
      }

      const data = await response.json();
      if (!data || data.length === 0) {
        throw new Error(`Ciudad "${cityName}" no encontrada`);
      }

      const location = data[0];
      return {
        lat: location.lat,
        lon: location.lon,
        name: location.name,
        country: location.country,
        state: location.state
      };
    } catch (error) {
      throw new Error(`Error en geocoding: ${error.message}`);
    }
  }

  /**
   * Obtiene datos del clima usando One Call API 3.0
   * @param {number} lat - Latitud
   * @param {number} lon - Longitud
   * @returns {Promise<Object>} Datos completos del clima
   */
  async getOneCallWeather(lat, lon) {
    try {
      const exclude = 'minutely,alerts'; // Excluir datos que no necesitamos por ahora
      const url = `${this.oneCallURL}?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${this.apiKey}&units=${this.units}&lang=${this.lang}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          // Si es 401, puede ser que One Call no esté disponible, usar API tradicional
          if (this.useOneCall) {
            // One Call API no disponible, usando API tradicional
            this.useOneCall = false;
            return null; // Retornar null para indicar que debe usar fallback
          }
          throw new Error('API Key inválida. Verifica tu configuración.');
        }
        if (response.status === 404) {
          throw new Error('Datos no encontrados para esta ubicación');
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
   * Obtiene el clima actual (método tradicional - fallback)
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
   * Obtiene pronóstico usando One Call API (incluido en getOneCallWeather)
   * Este método se mantiene para compatibilidad
   */
  async getForecast(cityName) {
    // Si usamos One Call, el pronóstico ya viene incluido
    // Este método ahora es un fallback
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
   * Obtiene clima por coordenadas usando One Call API o fallback
   */
  async getWeatherByCoords(lat, lon) {
    // Intentar usar One Call API primero
    if (this.useOneCall) {
      try {
        const oneCallData = await this.getOneCallWeather(lat, lon);
        if (oneCallData) {
          // Convertir formato One Call a formato tradicional para compatibilidad
          return this.convertOneCallToTraditional(oneCallData);
        }
      } catch (error) {
        // Error con One Call API, usando fallback
        this.useOneCall = false;
      }
    }

    // Fallback a API tradicional
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
   * Obtiene pronóstico por coordenadas usando One Call API
   */
  async getForecastByCoords(lat, lon) {
    // Si usamos One Call, el pronóstico ya viene en getOneCallWeather
    if (this.useOneCall) {
      try {
        const oneCallData = await this.getOneCallWeather(lat, lon);
        if (oneCallData && oneCallData.daily) {
          return oneCallData.daily.slice(0, 5).map(day => ({
            dt: day.dt,
            temp: day.temp,
            weather: day.weather,
            humidity: day.humidity,
            wind: { speed: day.wind_speed },
            rain: day.rain ? { '1h': day.rain } : null,
            pop: day.pop,
            clouds: day.clouds
          }));
        }
      } catch (error) {
        // Error con One Call API, usando fallback
        this.useOneCall = false;
      }
    }

    // Fallback
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

  /**
   * Convierte datos de One Call API a formato tradicional para compatibilidad
   */
  convertOneCallToTraditional(oneCallData) {
    const current = oneCallData.current;
    return {
      coord: {
        lat: oneCallData.lat,
        lon: oneCallData.lon
      },
      weather: current.weather || [{ id: 800, main: 'Clear', description: 'despejado', icon: '01d' }],
      main: {
        temp: current.temp,
        feels_like: current.feels_like,
        pressure: current.pressure,
        humidity: current.humidity
      },
      wind: {
        speed: current.wind_speed,
        deg: current.wind_deg
      },
      clouds: {
        all: current.clouds
      },
      visibility: current.visibility,
      sys: {
        country: oneCallData.timezone?.split('/')[1] || '',
        sunrise: current.sunrise,
        sunset: current.sunset
      },
      name: 'Current Location', // Se actualizará con geocoding reverso si es necesario
      dt: current.dt
    };
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

