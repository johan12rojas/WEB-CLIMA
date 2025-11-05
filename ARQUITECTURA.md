# 📐 Arquitectura de la Aplicación - Clima App

**Proyecto:** Aplicación Web del Clima  
**Autor:** Estudiante de Ingeniería de Sistemas - 7mo Semestre  
**Tecnología:** React.js con Vite

---

## 🎯 Introducción

Tenía que elegir una API de las opciones que me dieron, y me interesó la API del Clima de OpenWeatherMap. Me pareció la mejor opción de las que había según mis gustos, además de que hace tiempo quería desarrollar una web del clima con interfaz tipo iOS.

Como he venido trabajando en proyectos con React y Node, se me hizo muy interesante empezar con React para este proyecto. La idea era crear algo funcional pero con un diseño bonito, tipo iOS, que se viera profesional y moderno.

**Una cosa importante:** Usé Inteligencia Artificial para ayudarme con el diseño visual y mejorar la interfaz. La IA me ayudó a optimizar el glassmorphism, mejorar la distribución de componentes y sugerir mejoras en la experiencia de usuario. Esto me permitió crear un diseño más atractivo y funcional del que habría logrado por mi cuenta.

---

## 📁 Estructura del Proyecto

Organicé todo en carpetas para que sea fácil de entender y mantener. La estructura quedó así:

```
ARQUITECTURA- API/
├── index.html              # La página HTML principal
├── package.json            # Dependencias del proyecto
├── vite.config.js         # Configuración de Vite
├── src/
│   ├── main.jsx           # Aquí empieza React
│   ├── app/               # La aplicación principal
│   │   ├── App.jsx        # Componente que coordina todo
│   │   └── App.css        # Estilos globales
│   ├── config/            # Configuraciones
│   │   ├── config.js      # URLs de API, claves, etc.
│   │   └── videos.js      # URLs de los videos de fondo
│   ├── components/        # Componentes de React
│   │   ├── css/           # Estilos de cada componente
│   │   └── jsx/           # Los componentes JSX
│   ├── hooks/             # Hooks personalizados (lógica reutilizable)
│   │   ├── useWeather.js
│   │   ├── useFavorites.js
│   │   └── useGeolocation.js
│   ├── models/            # Modelos de datos (clases)
│   │   ├── Weather.js
│   │   ├── Forecast.js
│   │   └── City.js
│   ├── services/          # Servicios (API y storage)
│   │   ├── WeatherAPI.js
│   │   └── StorageService.js
│   └── img/               # Imágenes
```

### ¿Por qué así?

La idea es separar las cosas por responsabilidad:
- **components/**: Todo lo visual (botones, tarjetas, listas)
- **hooks/**: Lógica que se puede reutilizar
- **services/**: Comunicación con APIs y almacenamiento
- **models/**: Estructuras de datos
- **config/**: Configuraciones centralizadas

Esto hace que sea más fácil encontrar las cosas y modificar el código sin romper otras partes.

---

## 🔌 Cómo Consumo la API de OpenWeatherMap

Esta es la parte más importante del proyecto. Te explico cómo funciona:

### El Problema Inicial

OpenWeatherMap tiene varias APIs:
1. **API tradicional** (`/weather` y `/forecast`) - Funciona con nombre de ciudad
2. **One Call API 3.0** - Más completa pero requiere coordenadas y suscripción
3. **Geocoding API** - Convierte nombres de ciudades a coordenadas

### Mi Solución

Creé un sistema que intenta usar la mejor API disponible, pero si no funciona, hace un fallback automático a la tradicional. Así la app siempre funciona.

### El Servicio WeatherAPI

Este es el corazón de la comunicación con la API. Está en `services/WeatherAPI.js`.

#### Proceso de Búsqueda

Cuando el usuario busca una ciudad, pasa esto:

**1. Geocoding - Convertir nombre a coordenadas**
```javascript
// El usuario busca "Bogotá"
geocodeCity("Bogotá")
  ↓
// Hace una petición a:
GET https://api.openweathermap.org/geo/1.0/direct?q=Bogotá&limit=1&appid=mi_key
  ↓
// Recibe: { lat: 4.6097, lon: -74.0817, name: "Bogotá", country: "CO" }
```

**2. One Call API - Obtener datos completos**
```javascript
// Con las coordenadas, busca el clima completo
getOneCallWeather(4.6097, -74.0817)
  ↓
// Hace una petición a:
GET https://api.openweathermap.org/data/3.0/onecall?lat=4.6097&lon=-74.0817&appid=mi_key
  ↓
// Recibe: Datos actuales + pronóstico de 7 días + más información
```

**3. Si One Call falla → Fallback automático**
```javascript
// Si One Call no está disponible (sin suscripción, error 401, etc.)
// Automáticamente usa la API tradicional:
getCurrentWeather("Bogotá")  // Clima actual
getForecast("Bogotá")         // Pronóstico de 5 días
```

### El Hook useWeather

Este hook es el que coordina todo. Está en `hooks/useWeather.js` y funciona así:

```javascript
const searchWeather = async (cityName) => {
  // 1. Primero convierto el nombre a coordenadas
  const location = await weatherAPI.geocodeCity(cityName);
  
  // 2. Intento usar One Call API (la mejor)
  const oneCallData = await weatherAPI.getOneCallWeather(location.lat, location.lon);
  
  // 3. Si funcionó, uso esos datos
  if (oneCallData) {
    const currentData = weatherAPI.convertOneCallToTraditional(oneCallData);
    setWeather(new Weather(currentData));
    // ... proceso el pronóstico
  } 
  // 4. Si no funcionó, uso la API tradicional (fallback)
  else {
    const currentData = await weatherAPI.getCurrentWeather(cityName);
    setWeather(new Weather(currentData));
  }
}
```

### Flujo Completo (Ejemplo Real)

Vamos a ver qué pasa cuando alguien busca "Medellín":

1. Usuario escribe "Medellín" y presiona buscar
2. `SearchBar` llama a `handleSearch("Medellín")` en `App.jsx`
3. `App.jsx` llama a `searchWeather("Medellín")` del hook `useWeather`
4. `useWeather` llama a `geocodeCity("Medellín")` en `WeatherAPI`
5. `WeatherAPI` hace petición HTTP → `GET /geo/1.0/direct?q=Medellín`
6. OpenWeatherMap responde con: `{lat: 6.2476, lon: -75.5658, name: "Medellín", country: "CO"}`
7. `useWeather` llama a `getOneCallWeather(6.2476, -75.5658)`
8. `WeatherAPI` hace petición HTTP → `GET /data/3.0/onecall?lat=6.2476&lon=-75.5658`
9. OpenWeatherMap responde con datos completos del clima
10. `WeatherAPI` convierte los datos a formato estándar usando `convertOneCallToTraditional()`
11. `useWeather` crea objetos `Weather` y `Forecast` usando los modelos
12. React actualiza el estado y re-renderiza los componentes
13. El usuario ve: "Medellín, CO - 22°C - Nublado"

### Manejo de Errores

El código maneja diferentes tipos de errores:

- **404 (Ciudad no encontrada)**: Muestra "Ciudad no encontrada"
- **401 (API Key inválida o sin suscripción)**: Hace fallback automático a API tradicional
- **429 (Demasiadas peticiones)**: Muestra "Límite de peticiones excedido"
- **Error de red**: Muestra "Error de conexión. Verifica tu internet"

Lo importante es que siempre hay un fallback, entonces si One Call no funciona, la app sigue funcionando con la API tradicional.

### ¿Por qué esta Arquitectura?

1. **Resiliencia**: Si una API falla, la otra funciona
2. **Mejor experiencia**: Cuando One Call está disponible, obtiene más datos
3. **Flexibilidad**: Fácil cambiar entre APIs según disponibilidad
4. **Sin interrupciones**: El usuario no nota si cambia de API

---

## 🧩 Componentes Principales

### App.jsx - El Coordinador

Este componente es el que coordina todo:
- Usa los hooks (`useWeather`, `useFavorites`, `useGeolocation`)
- Maneja el estado global
- Decide qué mostrar según el estado
- Maneja eventos (búsqueda, favoritos, etc.)

### Componentes de Interfaz

Creé varios componentes reutilizables:
- **SearchBar**: Barra de búsqueda
- **WeatherCard**: Información principal del clima
- **ForecastList**: Pronóstico de 5 días
- **FavoritesList**: Lista de favoritos
- **HistoryList**: Historial de búsquedas
- **Clock**: Reloj en tiempo real
- **WeatherVideoBackground**: Videos de fondo que cambian según el clima
- **LoadingSpinner**: Indicador de carga
- **ErrorMessage**: Mensajes de error

---

## 🎣 Hooks Personalizados

### useWeather
Maneja todo lo del clima:
- `searchWeather(cityName)` - Busca clima por nombre
- `searchWeatherByCoords(lat, lon)` - Busca clima por coordenadas
- Retorna: `weather`, `forecast`, `loading`, `error`

### useFavorites
Maneja los favoritos:
- `addFavorite()` - Agrega ciudad
- `removeFavorite()` - Elimina ciudad
- `isFavorite()` - Verifica si está en favoritos
- Guarda todo en localStorage

### useGeolocation
Obtiene la ubicación del usuario:
- Usa `navigator.geolocation` del navegador
- Retorna coordenadas o error

---

## 🏗️ Modelos de Datos

Son clases que representan los datos:

- **Weather**: Clima actual (temperatura, humedad, viento, etc.)
- **Forecast**: Pronóstico de un día (temperaturas, descripción, probabilidad de lluvia)
- **City**: Ciudad guardada (nombre, país, coordenadas)

Los modelos tienen métodos útiles como `getIconUrl()` o `getFormattedTime()`.

---

## 🎨 Diseño Visual

Como mencioné al inicio, usé IA para mejorar el diseño. La IA me ayudó con:
- Optimizar los efectos glassmorphism (vidrio esmerilado)
- Mejorar la distribución de componentes en pantalla
- Sugerir colores y animaciones
- Refinar la experiencia de usuario

El resultado es un diseño moderno con:
- Efectos de vidrio esmerilado y transparencias
- Videos de fondo que cambian según el clima
- Colores que se adaptan al clima
- Diseño responsive (funciona en móvil, tablet y escritorio)

---

## 🛠️ Tecnologías Usadas

- **React 18**: Para construir la interfaz
- **Vite**: Para desarrollo rápido
- **OpenWeatherMap API**: Para datos del clima
- **localStorage**: Para guardar favoritos e historial

---

## 🎓 Conclusión

Esta arquitectura me permitió crear una aplicación que consume la API de OpenWeatherMap de manera eficiente y robusta. El sistema de fallback asegura que siempre funcione, incluso si alguna API no está disponible.

La estructura modular hace que sea fácil entender y modificar el código. Los hooks personalizados permiten reutilizar lógica, y los servicios centralizan la comunicación con APIs externas.

El uso de IA en el proceso de desarrollo fue muy útil para mejorar el aspecto visual y crear una experiencia de usuario más atractiva. Sin esa ayuda, el diseño habría sido más básico.

En general, estoy satisfecho con cómo quedó organizado el proyecto. La separación de responsabilidades y el sistema de fallback de APIs hacen que la aplicación sea robusta y fácil de mantener.
