import { useState, useEffect } from 'react';

/**
 * Hook personalizado para obtener la geolocalización del usuario
 */
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no está soportada en tu navegador');
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const success = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
      setLoading(false);
    };

    const errorCallback = (err) => {
      let errorMessage = 'Error al obtener ubicación';
      
      switch(err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Permiso de ubicación denegado';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Información de ubicación no disponible';
          break;
        case err.TIMEOUT:
          errorMessage = 'Tiempo de espera agotado';
          break;
        default:
          errorMessage = 'Error desconocido';
          break;
      }
      
      setError(errorMessage);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, errorCallback, options);
  }, []);

  return { location, error, loading };
}

