// Configuración de la aplicación
export const CONFIG = {
  API: {
    // API tradicional de OpenWeatherMap (funciona sin suscripción)
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    API_KEY: '7e4daf0b02898a9339a668ccac1a2f23',
    UNITS: 'metric',
    LANG: 'es'
  },
  STORAGE: {
    FAVORITES_KEY: 'weather_favorites',
    HISTORY_KEY: 'weather_history',
    MAX_HISTORY: 10
  }
};

