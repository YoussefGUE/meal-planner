import { useState } from 'react';
import { recipeService } from '../services/api';

function Explore() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      const data = await recipeService.search(query);
      if (Array.isArray(data)) {
        setResults(data);
        if (data.length === 0) setMessage('Aucun résultat trouvé');
      } else {
        setMessage('Erreur lors de la recherche');
      }
    } catch (err) {
      setMessage('Erreur lors de la recherche');
    }
    setLoading(false);
  };

  const handleImport = async (recipe) => {
    try {
      await recipeService.create({
        name: recipe.name,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        calories: recipe.calories,
        proteins: recipe.proteins,
        carbs: recipe.carbs,
        fats: recipe.fats,
        tags: recipe.tags ? JSON.parse(recipe.tags) : [],
        imageUrl: recipe.imageUrl,
        source: 'API'
      });
      setMessage(`"${recipe.name}" importée avec succès !`);
    } catch (err) {
      setMessage('Erreur lors de l\'import');
    }
  };

  return (
    <div className="explore-page">
      <div className="container">
        <div className="explore-header">
          <h1>Explorer</h1>
          <div className="divider"></div>
          <p className="explore-subtitle">Découvrez des milliers de recettes du monde entier</p>
        </div>

        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une recette... (ex: pasta, chicken, ramen)"
            className="search-input"
          />
          <button type="submit" className="btn-glow" disabled={loading}>
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {message && <p className="explore-message">{message}</p>}

        <div className="explore-grid">
          {results.map((recipe, index) => (
            <div key={index} className="explore-card">
              {recipe.imageUrl && (
                <img src={recipe.imageUrl} alt={recipe.name} className="explore-img" />
              )}
              <div className="explore-card-content">
                <h3>{recipe.name}</h3>
                <p>{recipe.instructions?.substring(0, 80)}...</p>
                <div className="meta">
                  <span>⏱ {recipe.prepTime} min</span>
                  <span>{recipe.calories ? `${Math.round(recipe.calories)} kcal` : ''}</span>
                </div>
                <div className="tags">
                  {recipe.tags && JSON.parse(recipe.tags).slice(0, 3).map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
                <button className="btn-glow" style={{marginTop: '16px', width: '100%'}} onClick={() => handleImport(recipe)}>
                  Importer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Explore;
