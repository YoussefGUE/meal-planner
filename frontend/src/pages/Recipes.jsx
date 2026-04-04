import { useState, useEffect } from 'react';
import { recipeService } from '../services/api';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [form, setForm] = useState({
    name: '', instructions: '', prepTime: '', calories: '', proteins: '', carbs: '', fats: '', tags: '', imageUrl: ''
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    const data = await recipeService.getAll();
    if (Array.isArray(data)) setRecipes(data);
  };

  const handleFilter = async (diet) => {
    setFilter(diet);
    if (diet === 'all') {
      loadRecipes();
    } else {
      const data = await recipeService.filter(diet);
      if (Array.isArray(data)) setRecipes(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipeData = {
      ...form,
      prepTime: parseInt(form.prepTime) || 0,
      calories: parseFloat(form.calories) || null,
      proteins: parseFloat(form.proteins) || null,
      carbs: parseFloat(form.carbs) || null,
      fats: parseFloat(form.fats) || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : []
    };

    if (editingRecipe) {
      await recipeService.update(editingRecipe.id, recipeData);
    } else {
      await recipeService.create(recipeData);
    }

    setShowModal(false);
    setEditingRecipe(null);
    setForm({ name: '', instructions: '', prepTime: '', calories: '', proteins: '', carbs: '', fats: '', tags: '', imageUrl: '' });
    loadRecipes();
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setForm({
      name: recipe.name,
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      calories: recipe.calories || '',
      proteins: recipe.proteins || '',
      carbs: recipe.carbs || '',
      fats: recipe.fats || '',
      tags: JSON.parse(recipe.tags || '[]').join(', '),
      imageUrl: recipe.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette recette ?')) {
      await recipeService.delete(id);
      loadRecipes();
    }
  };

  const openNewRecipe = () => {
    setEditingRecipe(null);
    setForm({ name: '', instructions: '', prepTime: '', calories: '', proteins: '', carbs: '', fats: '', tags: '', imageUrl: '' });
    setShowModal(true);
  };

  return (
    <div className="recipes-page">
      <div className="container">
        <div className="recipes-header">
          <h1>Mes Recettes</h1>
          <div className="divider"></div>
          <button onClick={openNewRecipe} className="btn-glow">+ Nouvelle recette</button>
        </div>

        <div className="filters">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilter('all')}>Toutes</button>
          <button className={`filter-btn ${filter === 'vegetarian' ? 'active' : ''}`} onClick={() => handleFilter('vegetarian')}>Végétarien</button>
          <button className={`filter-btn ${filter === 'gluten-free' ? 'active' : ''}`} onClick={() => handleFilter('gluten-free')}>Sans gluten</button>
          <button className={`filter-btn ${filter === 'low-carb' ? 'active' : ''}`} onClick={() => handleFilter('low-carb')}>Low carb</button>
        </div>

        <div className="recipes-grid">
          {recipes.length === 0 && (
            <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.6)', gridColumn: '1 / -1'}}>
              Aucune recette pour le moment. Créez votre première recette !
            </p>
          )}
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.name}</h3>
              <p>{recipe.instructions?.substring(0, 100)}...</p>
              <div className="meta">
                <span>⏱ {recipe.prepTime} min</span>
                <span>{recipe.calories ? `${recipe.calories} kcal` : ''}</span>
                <span className="tag">{recipe.source}</span>
              </div>
              <div className="tags">
                {JSON.parse(recipe.tags || '[]').map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
              <div className="recipe-actions">
                <button className="btn-small btn-edit" onClick={() => handleEdit(recipe)}>Modifier</button>
                <button className="btn-small btn-delete" onClick={() => handleDelete(recipe.id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingRecipe ? 'Modifier la recette' : 'Nouvelle recette'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Instructions</label>
                <textarea rows="4" value={form.instructions} onChange={e => setForm({...form, instructions: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Temps de préparation (min)</label>
                <input type="number" value={form.prepTime} onChange={e => setForm({...form, prepTime: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Calories</label>
                <input type="number" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Protéines (g)</label>
                <input type="number" value={form.proteins} onChange={e => setForm({...form, proteins: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Glucides (g)</label>
                <input type="number" value={form.carbs} onChange={e => setForm({...form, carbs: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Lipides (g)</label>
                <input type="number" value={form.fats} onChange={e => setForm({...form, fats: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Tags (séparés par des virgules)</label>
                <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="vegetarian, gluten-free, low-carb" />
              </div>
              <div className="form-group">
                <label>URL de l'image</label>
                <input type="text" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                <button type="submit" className="btn-glow" style={{flex: 1}}>
                  {editingRecipe ? 'Modifier' : 'Créer'}
                </button>
                <button type="button" className="btn-ghost" style={{flex: 1}} onClick={() => setShowModal(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recipes;
