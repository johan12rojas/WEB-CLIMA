import '../css/FavoritesList.css';

export function FavoritesList({ favorites, onSelectCity, onRemoveFavorite }) {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-container">
        <h3 className="section-title">Favoritos</h3>
        <p className="empty-message">
          No tienes ciudades favoritas aún. Agrega una usando el botón ★
        </p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h3 className="section-title">Favoritos</h3>
      <div className="favorites-grid">
        {favorites.map((city) => (
          <div key={city.id} className="favorite-card">
            <button
              className="favorite-card-button"
              onClick={() => onSelectCity(city.name)}
            >
              <span className="favorite-name">{city.getFullName()}</span>
            </button>
            <button
              className="remove-favorite-button"
              onClick={() => onRemoveFavorite(city.id)}
              aria-label="Eliminar de favoritos"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

