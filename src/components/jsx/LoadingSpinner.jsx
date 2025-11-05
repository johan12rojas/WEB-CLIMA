import '../css/LoadingSpinner.css';

export function LoadingSpinner() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <p className="loading-text">Cargando...</p>
    </div>
  );
}

