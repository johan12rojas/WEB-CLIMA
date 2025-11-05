# 📐 Arquitectura de la Aplicación – Clima App

**Proyecto:** Aplicación Web del Clima  
**Autor:** Estudiante de Ingeniería de Sistemas – 7mo Semestre  
**Tecnología:** React.js con Vite

---

## 🎯 Introducción

Entre las diferentes opciones disponibles, elegí trabajar con la API de OpenWeatherMap porque me pareció una alternativa interesante para explorar el consumo de servicios externos y el manejo de datos en tiempo real. Además, ofrecía una buena oportunidad para aplicar lo aprendido en React y crear una interfaz moderna con un diseño inspirado en el estilo visual de iOS.

Durante el desarrollo, consulté la documentación oficial de la API, lo que me permitió comprender en detalle cómo funcionan sus distintos endpoints, parámetros y limitaciones. A medida que avanzaba, surgieron algunos inconvenientes técnicos, principalmente relacionados con la obtención de coordenadas y el tratamiento de errores en las respuestas. En esos casos, recurrí al apoyo de herramientas de Inteligencia Artificial, que me ayudaron a encontrar soluciones, depurar el código y optimizar la lógica de consumo de la API.

Gracias a mi experiencia previa con React y Node.js, pude centrarme tanto en la funcionalidad como en el diseño visual. La IA también fue de gran utilidad en esta parte, ya que me permitió ajustar los efectos de glassmorphism, mejorar la distribución de los componentes y lograr una interfaz más equilibrada y profesional.

---

## 🏛️ Patrón Arquitectónico

Este proyecto no sigue un patrón arquitectónico tradicional estricto como MVC o MVP, sino que utiliza una **combinación de patrones adaptados a React**, enfocándose en la separación de responsabilidades y la modularidad.

### Patrones Aplicados

1. **Component-Based Architecture (Arquitectura Basada en Componentes)**
   - La aplicación está construida como un conjunto de componentes React reutilizables
   - Cada componente tiene una responsabilidad única (presentación, lógica de UI)
   - Los componentes se comunican mediante props y callbacks

2. **Service Layer Pattern (Patrón de Capa de Servicio)**
   - La lógica de negocio y comunicación con APIs está separada en servicios (`WeatherAPI.js`, `StorageService.js`)
   - Los componentes no interactúan directamente con APIs, sino a través de servicios
   - Esto facilita el mantenimiento y testing

3. **Custom Hooks Pattern (Patrón de Hooks Personalizados)**
   - La lógica de estado y efectos se encapsula en hooks reutilizables
   - Los hooks actúan como una capa intermedia entre componentes y servicios
   - Permiten compartir lógica entre componentes sin duplicación

4. **Model/Entity Pattern (Patrón de Modelos)**
   - Las estructuras de datos están definidas como clases (`Weather`, `Forecast`, `City`)
   - Los modelos encapsulan la lógica de transformación y formateo de datos
   - Proporcionan una interfaz consistente para trabajar con los datos

5. **Separation of Concerns (Separación de Responsabilidades)**
   - Cada capa tiene una función específica:
     - **Componentes**: Presentación y UI
     - **Hooks**: Lógica de estado y efectos
     - **Servicios**: Comunicación externa y lógica de negocio
     - **Modelos**: Estructura y validación de datos
     - **Config**: Configuración centralizada

### Flujo de Datos

```
Usuario → Componente → Hook → Servicio → API Externa
                    ↓
              Modelo (transformación)
                    ↓
              Hook (actualiza estado)
                    ↓
              Componente (re-render)
```

Este enfoque híbrido es común en aplicaciones React modernas y permite:
- **Mantenibilidad**: Código organizado y fácil de entender
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Testabilidad**: Cada capa se puede probar independientemente
- **Reutilización**: Componentes y hooks se pueden usar en múltiples lugares

---

## 📁 Estructura del Proyecto

Para mantener el orden y facilitar la comprensión del código, organicé el proyecto en carpetas según su responsabilidad. La estructura general quedó así:

```
ARQUITECTURA-API/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── app/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── config/
│   │   ├── config.js
│   │   └── videos.js
│   ├── components/
│   │   ├── css/
│   │   │   ├── Clock.css
│   │   │   ├── ErrorMessage.css
│   │   │   ├── FavoritesList.css
│   │   │   ├── ForecastList.css
│   │   │   ├── HistoryList.css
│   │   │   ├── LoadingSpinner.css
│   │   │   ├── SearchBar.css
│   │   │   ├── WeatherCard.css
│   │   │   └── WeatherVideoBackground.css
│   │   └── jsx/
│   │       ├── Clock.jsx
│   │       ├── ErrorMessage.jsx
│   │       ├── FavoritesList.jsx
│   │       ├── ForecastList.jsx
│   │       ├── HistoryList.jsx
│   │       ├── LoadingSpinner.jsx
│   │       ├── SearchBar.jsx
│   │       ├── WeatherCard.jsx
│   │       └── WeatherVideoBackground.jsx
│   ├── hooks/
│   │   ├── useWeather.js
│   │   ├── useFavorites.js
│   │   └── useGeolocation.js
│   ├── models/
│   │   ├── Weather.js
│   │   ├── Forecast.js
│   │   └── City.js
│   ├── services/
│   │   ├── WeatherAPI.js
│   │   └── StorageService.js
│   └── img/
│       └── icon.webp
```

### Justificación de la Estructura

Cada carpeta cumple una función específica:

- **`components/`**: contiene los elementos visuales como botones, tarjetas o listas. Se organizó en `css/` para estilos y `jsx/` para componentes React.
- **`hooks/`**: agrupa la lógica reutilizable que encapsula el comportamiento de la aplicación.
- **`services/`**: maneja la comunicación con la API y el almacenamiento local.
- **`models/`**: define las estructuras de datos que representan las entidades del dominio.
- **`config/`**: centraliza las configuraciones generales del proyecto (API keys, URLs, etc.).

Esta organización facilita la lectura, el mantenimiento y la escalabilidad del código.

---

## 🔌 Consumo de la API de OpenWeatherMap

El consumo de la API fue el eje central del proyecto. Para comprender su funcionamiento, dediqué tiempo a revisar la documentación oficial, especialmente las secciones relacionadas con las peticiones al endpoint `/weather`, el uso de coordenadas y el manejo de respuestas JSON.

### La API que Uso

OpenWeatherMap tiene varias APIs, pero como no tengo suscripción, uso solo la **API tradicional** que funciona gratis:
- **`/weather`** - Para obtener el clima actual de una ciudad
- **`/forecast`** - Para obtener el pronóstico de 5 días

Esta API funciona directamente con el nombre de la ciudad o con coordenadas, entonces no necesito Geocoding ni One Call API.

### El Servicio WeatherAPI

Este es el corazón de la comunicación con la API. Está en `services/WeatherAPI.js` y gestiona toda la comunicación con OpenWeatherMap.

#### Proceso de Búsqueda

Cuando el usuario busca una ciudad, pasa esto:

**1. Obtener clima actual**
```javascript
// El usuario busca "Bogotá"
getCurrentWeather("Bogotá")
  ↓
// Hace una petición a:
GET https://api.openweathermap.org/data/2.5/weather?q=Bogotá&appid=mi_key&units=metric&lang=es
  ↓
// Recibe: Datos del clima actual (temperatura, humedad, viento, etc.)
```

**2. Obtener pronóstico**
```javascript
// Después busca el pronóstico de 5 días
getForecast("Bogotá")
  ↓
// Hace una petición a:
GET https://api.openweathermap.org/data/2.5/forecast?q=Bogotá&appid=mi_key&units=metric&lang=es
  ↓
// Recibe: Pronóstico de 5 días con datos cada 3 horas
```

### El Hook useWeather

Este hook es el que coordina todo. Está en `hooks/useWeather.js` y funciona así:

```javascript
const searchWeather = async (cityName) => {
  // 1. Obtengo el clima actual directamente con el nombre de la ciudad
  const currentData = await weatherAPI.getCurrentWeather(cityName);
  setWeather(new Weather(currentData));
  
  // 2. Obtengo el pronóstico de 5 días
  try {
    const forecastData = await weatherAPI.getForecast(cityName);
    setForecast(forecastData.map(item => new Forecast(item)));
  } catch (forecastErr) {
    setForecast([]);
  }
}
```

### Flujo Completo (Ejemplo Real)

Vamos a ver qué pasa cuando alguien busca "Medellín":

1. Usuario escribe "Medellín" y presiona buscar
2. `SearchBar` llama a `handleSearch("Medellín")` en `App.jsx`
3. `App.jsx` llama a `searchWeather("Medellín")` del hook `useWeather`
4. `useWeather` llama a `getCurrentWeather("Medellín")` en `WeatherAPI`
5. `WeatherAPI` hace petición HTTP → `GET /data/2.5/weather?q=Medellín&appid=mi_key`
6. OpenWeatherMap responde con datos del clima actual
7. `useWeather` crea objeto `Weather` con esos datos
8. `useWeather` llama a `getForecast("Medellín")` para el pronóstico
9. `WeatherAPI` hace petición HTTP → `GET /data/2.5/forecast?q=Medellín&appid=mi_key`
10. OpenWeatherMap responde con pronóstico de 5 días
11. `useWeather` procesa los datos y crea objetos `Forecast`
12. React actualiza el estado y re-renderiza los componentes
13. El usuario ve: "Medellín, CO - 22°C - Nublado"

### Manejo de Errores

El código maneja diferentes tipos de errores:

- **404 (Ciudad no encontrada)**: Muestra "Ciudad no encontrada. Intenta con otro nombre."
- **401 (API Key inválida)**: Muestra "API Key inválida. Verifica tu configuración."
- **429 (Demasiadas peticiones)**: Muestra "Límite de peticiones excedido. Intenta más tarde."
- **Error de red**: Muestra "Error de conexión. Verifica tu internet."

Algunos errores de autenticación y formato de datos fueron resueltos con apoyo de IA, lo que permitió optimizar el flujo de peticiones y asegurar respuestas más consistentes.

### ¿Por qué Solo la API Tradicional?

1. **Simplicidad**: No necesito suscripción ni configuración adicional
2. **Funcionalidad completa**: Con `/weather` y `/forecast` tengo todo lo necesario
3. **Funciona con nombre de ciudad**: No necesito Geocoding para convertir nombres
4. **Gratis**: La API tradicional tiene un plan gratuito generoso

---

## 🧩 Componentes Principales

### App.jsx – El núcleo del sistema

Este componente coordina todos los elementos de la aplicación:

- Usa los hooks (`useWeather`, `useFavorites`, `useGeolocation`)
- Controla el estado global
- Maneja los eventos principales (búsqueda, favoritos, errores, etc.)
- Decide qué componentes mostrar en cada momento

### Componentes de Interfaz

Se desarrollaron varios componentes reutilizables:

- **`SearchBar`**: barra de búsqueda con validación de entrada
- **`WeatherCard`**: muestra el clima actual con todos los detalles (temperatura, humedad, viento, presión, visibilidad, amanecer, atardecer)
- **`ForecastList`**: despliega el pronóstico de varios días
- **`FavoritesList`**: administra las ciudades favoritas almacenadas en `localStorage`
- **`HistoryList`**: conserva el historial de consultas recientes
- **`Clock`**: reloj en tiempo real con formato 12h AM/PM
- **`WeatherVideoBackground`**: cambia los videos de fondo según las condiciones climáticas
- **`LoadingSpinner`**: muestra un indicador de carga durante las peticiones
- **`ErrorMessage`**: gestiona los mensajes de error de forma elegante

Cada componente está separado en su propio archivo JSX y tiene su CSS correspondiente en la carpeta `components/css/`.

---

## 🎣 Hooks Personalizados

Los hooks organizan la lógica y la hacen reutilizable:

### useWeather

Maneja las peticiones y el estado del clima. Se encarga de:
- Realizar búsquedas por nombre de ciudad
- Realizar búsquedas por coordenadas (para geolocalización)
- Gestionar estados de carga y error
- Transformar los datos de la API en objetos `Weather` y `Forecast`

### useFavorites

Gestiona los datos almacenados en `localStorage` para las ciudades favoritas:
- Agregar ciudades a favoritos
- Remover ciudades de favoritos
- Verificar si una ciudad está en favoritos
- Cargar favoritos al iniciar la aplicación

### useGeolocation

Obtiene la ubicación actual del usuario mediante el navegador usando `navigator.geolocation`:
- Solicita permiso al usuario para acceder a su ubicación
- Obtiene coordenadas (latitud y longitud)
- Maneja errores de permisos o disponibilidad
- Automáticamente busca el clima de la ubicación del usuario al cargar la app

---

## 🏗️ Modelos de Datos

Los modelos representan las entidades principales:

### Weather

Representa el clima actual de una ciudad:
- Información básica: ciudad, país, temperatura, descripción
- Detalles: humedad, velocidad del viento, presión atmosférica
- Información adicional: visibilidad, nubosidad, amanecer, atardecer
- Coordenadas geográficas
- Métodos para formatear datos (como `getFormattedTime()` para amanecer/atardecer)

### Forecast

Representa el pronóstico diario:
- Fecha del pronóstico
- Temperatura mínima y máxima
- Condiciones climáticas (descripción, icono)
- Detalles adicionales: humedad, viento, probabilidad de lluvia, nubosidad

### City

Define los datos básicos de cada ciudad:
- Nombre de la ciudad
- País
- Coordenadas (latitud, longitud)
- ID único para identificación en favoritos

Cada modelo incluye métodos para procesar y formatear los datos antes de mostrarlos en la interfaz.

---

## 🎨 Diseño Visual

El diseño combina simplicidad y modernidad, inspirado en el entorno visual de iOS. Con la ayuda de la IA, se optimizaron aspectos como:

- **Glassmorphism**: Efectos de vidrio esmerilado con `backdrop-filter: blur()` y transparencias
- **Distribución de componentes**: Uso de CSS Grid para layouts responsivos en escritorio y móvil
- **Combinaciones de color**: Paleta de colores suaves con gradientes y sombras sutiles
- **Videos de fondo dinámicos**: Cambian según las condiciones climáticas (soleado, lluvioso, tormenta, nublado, templado)
- **Fluidez de la experiencia**: Transiciones suaves y animaciones sutiles

El resultado es una interfaz visualmente atractiva, responsiva y coherente en distintos dispositivos. La aplicación se adapta tanto a pantallas horizontales (escritorio) como verticales (móvil), optimizando el espacio disponible.

### Características de Diseño

- **Responsive Design**: Grid adaptativo que cambia de 1 columna (móvil) a 3 columnas (escritorio)
- **Tema dinámico**: Los fondos y colores cambian según el clima actual
- **Typography**: Fuentes del sistema (`-apple-system`, `SF Pro Display`) para un look nativo
- **Espaciado consistente**: Uso de padding y margins uniformes
- **Iconografía**: Iconos SVG minimalistas que reemplazan emojis para mejor consistencia visual

---

## 🛠️ Tecnologías Utilizadas

- **React 18** – para la interfaz interactiva y gestión de estado
- **Vite** – entorno de desarrollo rápido y optimizado
- **OpenWeatherMap API** – fuente de datos meteorológicos (API tradicional)
- **localStorage** – para guardar favoritos e historial de forma persistente
- **navigator.geolocation** – API del navegador para detección automática de ubicación
- **CSS3** – para estilos modernos, grid, flexbox, animaciones y efectos visuales

---

## 🎓 Conclusión

El desarrollo de esta aplicación del clima me permitió explorar de manera práctica el consumo de una API real, entender su documentación técnica y aplicar buenas prácticas de arquitectura en React.

La lectura detallada de la documentación oficial de OpenWeatherMap fue clave para comprender su estructura, mientras que el uso de herramientas de Inteligencia Artificial resultó esencial para resolver errores, refinar el código y mejorar tanto el rendimiento como el diseño.

La arquitectura modular, la organización por componentes y la separación de responsabilidades contribuyen a que la aplicación sea funcional, estable y fácil de mantener. El uso exclusivo de la API tradicional garantiza que la aplicación funcione sin necesidad de suscripciones adicionales, mientras que el sistema de manejo de errores asegura una experiencia de usuario fluida incluso cuando algo falla.

En conjunto, este proyecto refleja un equilibrio entre programación, diseño y aprendizaje autónomo apoyado en tecnologías inteligentes, demostrando cómo se pueden combinar conocimientos técnicos, herramientas modernas y ayuda de IA para crear aplicaciones funcionales y visualmente atractivas.
