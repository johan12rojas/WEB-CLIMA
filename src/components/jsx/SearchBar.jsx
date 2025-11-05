import { useState } from 'react';
import '../css/SearchBar.css';

export function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      await onSearch(trimmedQuery);
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            id="city-search"
            name="city-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ciudad (ej: Madrid, Bogotá, New York)..."
            className="search-input"
            autoComplete="off"
            disabled={loading}
          />
          <button 
            type="submit" 
            name="search-button"
            className="search-button"
            disabled={loading || !query.trim()}
            aria-label="Buscar ciudad"
          >
            {loading ? '⏳' : '🔍'}
          </button>
        </div>
      </form>
    </div>
  );
}

