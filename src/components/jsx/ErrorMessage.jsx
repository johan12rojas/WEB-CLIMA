import '../css/ErrorMessage.css';

export function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{message}</span>
      {onClose && (
        <button 
          className="error-close" 
          onClick={onClose}
          aria-label="Cerrar mensaje de error"
        >
          ×
        </button>
      )}
    </div>
  );
}

