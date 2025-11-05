# 🌤️ Clima App - React con Estilo iOS

Aplicación web moderna del clima construida con **React** y **Vite**, con un diseño inspirado en la app del clima de iPhone. Consume la API de OpenWeatherMap con arquitectura MVC bien definida y código limpio.

## 🎯 Características

### Funcionalidades Principales
- ✅ **Clima Actual**: Información detallada con diseño estilo iOS
- ✅ **Pronóstico Extendido**: Pronóstico de 5 días con lista elegante
- ✅ **Ciudades Favoritas**: Guarda y gestiona tus ciudades favoritas
- ✅ **Búsqueda Intuitiva**: Búsqueda rápida y eficiente
- ✅ **Diseño Responsive**: Perfecto para móviles y tablets
- ✅ **Temas Dinámicos**: Fondo y colores que cambian según el clima
- ✅ **Efectos Glassmorphism**: Diseño moderno con blur y transparencias

### Valor Agregado
- 🎨 **Diseño Inspirado en iOS**: Interfaz limpia y elegante como la app de Apple
- 🧠 **Arquitectura MVC**: Código bien organizado y escalable
- 💾 **Persistencia Local**: Favoritos guardados en localStorage
- ⚡ **Rendimiento Optimizado**: React con Vite para carga rápida
- 🌈 **Animaciones Suaves**: Transiciones y efectos visuales

## 🏗️ Arquitectura

El proyecto sigue el **patrón MVC (Modelo-Vista-Controlador)** adaptado a React:

```
ARQUITECTURA- API/
├── package.json              # Dependencias y scripts
├── vite.config.js           # Configuración de Vite
├── index.html               # HTML principal
├── README.md                # Documentación
└── src/
    ├── main.jsx             # Punto de entrada React
    ├── app/                 # Aplicación principal
    │   ├── App.jsx          # Componente principal
    │   └── App.css          # Estilos globales
    ├── config/              # Configuración
    │   ├── config.js        # Configuración de la aplicación
    │   └── videos.js        # URLs de videos de fondo
    ├── models/              # Modelos de datos
    │   ├── Weather.js
    │   ├── Forecast.js
    │   └── City.js
    ├── services/            # Servicios y lógica de negocio
    │   ├── WeatherAPI.js
    │   └── StorageService.js
    ├── hooks/               # Hooks personalizados de React
    │   ├── useWeather.js
    │   ├── useFavorites.js
    │   └── useGeolocation.js
    └── components/          # Componentes React
        ├── css/             # Estilos de componentes
        │   ├── Clock.css
        │   ├── SearchBar.css
        │   ├── WeatherCard.css
        │   └── ...
        └── jsx/             # Componentes JSX
            ├── Clock.jsx
            ├── SearchBar.jsx
            ├── WeatherCard.jsx
            └── ...
```

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Verificar API Key

La API key ya está configurada en `src/config.js`. Si necesitas cambiarla:

```javascript
export const CONFIG = {
  API: {
    API_KEY: 'tu_api_key_aqui',
    // ...
  }
};
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### 4. Construir para producción

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`

### 5. Preview de producción

```bash
npm run preview
```

## 📖 Uso

1. **Buscar una ciudad**: Escribe el nombre en el buscador y presiona Enter o el botón de búsqueda
2. **Ver información del clima**: La app mostrará:
   - Temperatura actual grande y visible
   - Condiciones climáticas con iconos
   - Detalles adicionales (humedad, viento, presión, etc.)
   - Pronóstico de 5 días
3. **Agregar a favoritos**: Haz clic en el botón ★ en la tarjeta del clima
4. **Gestionar favoritos**: Ve la sección de favoritos en la parte inferior
5. **Cargar ciudad favorita**: Haz clic en cualquier ciudad favorita para ver su clima

## 🛠️ Tecnologías Utilizadas

- **React 18**: Biblioteca para construir la interfaz
- **Vite**: Build tool moderna y rápida
- **CSS3**: Estilos modernos con glassmorphism y gradientes
- **OpenWeatherMap API**: API REST para datos meteorológicos
- **LocalStorage**: Almacenamiento local del navegador

## 🎨 Diseño

El diseño está inspirado en la aplicación del clima de iPhone con:
- **Glassmorphism**: Efectos de vidrio con blur y transparencias
- **Tipografía**: Fuentes del sistema de Apple (SF Pro Display)
- **Colores**: Gradientes dinámicos según el clima
- **Animaciones**: Transiciones suaves y naturales
- **Layout**: Diseño limpio y minimalista

## 📋 Componentes Principales

### `App.jsx`
Componente principal que coordina toda la aplicación

### `WeatherCard.jsx`
Tarjeta principal que muestra el clima actual con diseño estilo iOS

### `ForecastList.jsx`
Lista de pronóstico extendido con diseño minimalista

### `FavoritesList.jsx`
Lista de ciudades favoritas con tarjetas interactivas

### `SearchBar.jsx`
Barra de búsqueda con diseño moderno

## 🔧 Hooks Personalizados

### `useWeather`
Hook para manejar el estado del clima y las búsquedas

### `useFavorites`
Hook para gestionar las ciudades favoritas

## 📝 Notas Importantes

- La API de OpenWeatherMap tiene límites de uso en el plan gratuito (60 llamadas/minuto)
- Los datos se almacenan localmente en el navegador (localStorage)
- La aplicación requiere conexión a internet para obtener datos nuevos

## 🔮 Funcionalidades Implementadas

- ✅ Geolocalización automática
- ✅ Videos de fondo dinámicos según el clima
- ✅ Reloj en tiempo real con formato 12h AM/PM
- ✅ Historial de búsquedas
- ✅ Favoritos persistentes
- ✅ Diseño responsive para escritorio y móvil

## 📄 Licencia

Este proyecto es para fines educativos y universitarios.

## 👨‍💻 Autor

Proyecto desarrollado para actividad extraclase universitaria.

---

**¡Disfruta del clima con estilo iOS! 🌈**
