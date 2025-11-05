import { StorageService } from '../../services/StorageService.js';
import { CONFIG } from '../../config/config.js';
import '../css/HistoryList.css';

export function HistoryList({ onSelectCity }) {
  const storageService = new StorageService(CONFIG);
  const history = storageService.getHistory();

  if (!history || history.length === 0) {
    return null;
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="history-container">
      <h3 className="section-title">Búsquedas Recientes</h3>
      <div className="history-list">
        {history.map((item, index) => (
          <button
            key={index}
            className="history-item"
            onClick={() => onSelectCity(item.name)}
          >
            <div className="history-content">
              <span className="history-city">{item.name}</span>
              {item.country && (
                <span className="history-country">{item.country}</span>
              )}
            </div>
            <span className="history-time">{formatDate(item.timestamp)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

