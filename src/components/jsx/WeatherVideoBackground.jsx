import { useEffect, useState, useRef } from 'react';
import { WEATHER_VIDEOS } from '../../config/videos.js';
import '../css/WeatherVideoBackground.css';

export function WeatherVideoBackground({ weather }) {
  const [videoSource, setVideoSource] = useState(null);
  const [videoType, setVideoType] = useState('default');
  const videoRef = useRef(null);

  useEffect(() => {
    if (!weather) {
      setVideoSource(null);
      setVideoType('default');
      return;
    }

    const weatherId = weather.weatherId;
    const main = (weather.main || '').toLowerCase();
    const desc = weather.description.toLowerCase();
    const icon = weather.icon || '';
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 20;
    const temp = weather.temperature || 0;
    const clouds = weather.clouds || 0;
    const humidity = weather.humidity || 0;
    
    let videoFile = null;
    let type = 'default';

    // Sistema de prioridades mejorado para selección de videos
    // Basado en códigos de OpenWeatherMap: https://openweathermap.org/weather-conditions
    
    // PRIORIDAD 1: Tormenta (Thunderstorm) - IDs 200-232
    if (weatherId >= 200 && weatherId < 300 || 
        desc.includes('tormenta') || desc.includes('thunderstorm') || desc.includes('trueno')) {
      videoFile = WEATHER_VIDEOS.storm;
      type = 'storm';
    }
    // PRIORIDAD 2: Lluvia (Rain, Drizzle) - IDs 300-531
    else if (weatherId >= 300 && weatherId < 600 || 
             desc.includes('lluvia') || desc.includes('rain') || desc.includes('drizzle') ||
             (humidity > 75 && clouds > 60 && main === 'rain')) {
      videoFile = WEATHER_VIDEOS.rainy;
      type = 'rainy';
    }
    // PRIORIDAD 3: Nieve (Snow) - IDs 600-622
    else if (weatherId >= 600 && weatherId < 700 || 
             desc.includes('nieve') || desc.includes('snow') ||
             (temp < 3 && (main === 'snow' || desc.includes('nev')))) {
      videoFile = WEATHER_VIDEOS.normal;
      type = 'snowy';
    }
    // PRIORIDAD 4: Clima Templado (Temperaturas moderadas, condiciones suaves)
    // Temperatura entre 15-25°C, sin condiciones extremas, nubes moderadas
    else if (temp >= 15 && temp <= 25 && 
             clouds >= 20 && clouds <= 60 &&
             humidity >= 40 && humidity <= 75 &&
             !desc.includes('tormenta') && !desc.includes('lluvia') && 
             !desc.includes('soleado') && !desc.includes('despejado') &&
             (weatherId >= 801 && weatherId <= 803)) {
      videoFile = WEATHER_VIDEOS.temperate;
      type = 'temperate';
    }
    // PRIORIDAD 5: Despejado/Clear (IDs 800) o Soleado
    // Condiciones: pocas nubes, temperatura cálida, día claro
    else if (weatherId === 800 || main === 'clear' ||
             (clouds < 25 && isDay && temp > 20 && 
              (desc.includes('despejado') || desc.includes('clear') || 
               desc.includes('soleado') || desc.includes('sunny')))) {
      if (isDay) {
        videoFile = WEATHER_VIDEOS.sunny;
        type = 'sunny';
      } else {
        videoFile = null;
        type = 'clear-night';
      }
    }
    // PRIORIDAD 6: Nublado (Clouds) - IDs 801-804
    // Condiciones: muchas nubes, pero sin lluvia
    else if ((weatherId >= 801 && weatherId <= 804) || main === 'clouds' ||
             (clouds > 50 && !desc.includes('lluvia') && !desc.includes('rain'))) {
      // Si es clima templado (temp 15-25°C), usar video templado
      if (temp >= 15 && temp <= 25 && humidity >= 40 && humidity <= 75) {
        videoFile = WEATHER_VIDEOS.temperate;
        type = 'temperate';
      } else {
        videoFile = WEATHER_VIDEOS.normal;
        type = 'cloudy';
      }
    }
    // PRIORIDAD 7: Atmósfera (Fog, Mist, etc.) - IDs 700-799
    else if (weatherId >= 700 && weatherId < 800) {
      videoFile = WEATHER_VIDEOS.normal;
      type = 'cloudy';
    }
    // PRIORIDAD 8: Fallback por temperatura y condiciones del día
    else if (temp > 25 && isDay && clouds < 40) {
      videoFile = WEATHER_VIDEOS.sunny;
      type = 'sunny';
    }
    // Fallback por temperatura templada
    else if (temp >= 15 && temp <= 25 && isDay) {
      videoFile = WEATHER_VIDEOS.temperate;
      type = 'temperate';
    }
    // Fallback final: usar descripción si no hay ID
    else {
      if (desc.includes('tormenta') || desc.includes('thunderstorm') || desc.includes('trueno')) {
        videoFile = WEATHER_VIDEOS.storm;
        type = 'storm';
      } else if (desc.includes('lluvia') || desc.includes('lluvioso') || desc.includes('rain') || desc.includes('drizzle')) {
        videoFile = WEATHER_VIDEOS.rainy;
        type = 'rainy';
      } else if (desc.includes('soleado') || desc.includes('despejado') || desc.includes('clear') || desc.includes('sunny')) {
        if (isDay) {
          videoFile = WEATHER_VIDEOS.sunny;
          type = 'sunny';
        } else {
          videoFile = null;
          type = 'clear-night';
        }
      } else if (desc.includes('nublado') || desc.includes('cloud') || desc.includes('niebla') || desc.includes('neblina')) {
        // Si es templado, usar video templado
        if (temp >= 15 && temp <= 25) {
          videoFile = WEATHER_VIDEOS.temperate;
          type = 'temperate';
        } else {
          videoFile = WEATHER_VIDEOS.normal;
          type = 'cloudy';
        }
      } else {
        // Fallback final: usar templado si temperatura es moderada, sino normal
        if (temp >= 15 && temp <= 25 && isDay) {
          videoFile = WEATHER_VIDEOS.temperate;
          type = 'temperate';
        } else {
          videoFile = WEATHER_VIDEOS.normal;
          type = 'default';
        }
      }
    }

    setVideoType(type);
    setVideoSource(videoFile);
  }, [weather]);

  // Aplicar efecto slow motion al video
  useEffect(() => {
    if (videoRef.current) {
      // Reducir velocidad de reproducción para efecto slow motion
      videoRef.current.playbackRate = 0.7; // 70% de velocidad = slow motion
    }
  }, [videoSource]);

  // Si no hay video o la URL está vacía, no renderizar nada (el gradiente CSS se encargará)
  if (!videoSource || videoSource.trim() === '') {
    return null;
  }

  return (
    <div className="weather-video-container">
      <video
        ref={videoRef}
        key={videoSource} // Forzar re-render cuando cambia el video
        className={`weather-video weather-video-${videoType}`}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        onCanPlay={() => {
          if (videoRef.current) {
            videoRef.current.playbackRate = 0.7; // Slow motion
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            videoRef.current.playbackRate = 0.7; // Slow motion
          }
        }}
        onError={(e) => {
          console.error('❌ Error cargando video:', videoSource);
          console.error('Error details:', e);
          // Usando fallback a gradiente
          setVideoSource(null); // Fallback a gradiente si el video no carga
        }}
      >
        <source src={videoSource} type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>
      <div className="video-overlay"></div>
    </div>
  );
}

