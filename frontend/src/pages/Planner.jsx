import { useState, useEffect } from 'react';
import { recipeService } from '../services/api';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS = { MONDAY: 'Lundi', TUESDAY: 'Mardi', WEDNESDAY: 'Mercredi', THURSDAY: 'Jeudi', FRIDAY: 'Vendredi', SATURDAY: 'Samedi', SUNDAY: 'Dimanche' };
const MEALS = ['BREAKFAST', 'LUNCH', 'DINNER'];
const MEAL_LABELS = { BREAKFAST: 'Petit-déj', LUNCH: 'Déjeuner', DINNER: 'Dîner' };
const API_URL = 'http://localhost:5000/api';

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function Planner() {
  const [mealPlan, setMealPlan] = useState(null);
  const [entries, setEntries] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ day: '', mealType: '' });
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));

  useEffect(() => {
    loadPlan();
    loadRecipes();
  }, [weekStart]);

  const loadPlan = async () => {
    try {
      const res = await fetch(`${API_URL}/mealplans/${weekStart}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setMealPlan(data);
        setEntries(data.MealPlanEntries || []);
      } else {
        setMealPlan(null);
        setEntries([]);
      }
    } catch (err) {
      setMealPlan(null);
      setEntries([]);
    }
  };

  const loadRecipes = async () => {
    const data = await recipeService.getAll();
    if (Array.isArray(data)) setRecipes(data);
  };

  const createPlan = async () => {
    try {
      const res = await fetch(`${API_URL}/mealplans`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ weekStartDate: weekStart })
      });
      if (res.ok) {
        const data = await res.json();
        setMealPlan(data);
        setEntries([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openSlot = (day, mealType) => {
    if (!mealPlan) return;
    setSelectedSlot({ day, mealType });
    setShowModal(true);
  };

  const assignRecipe = async (recipeId) => {
    try {
      const res = await fetch(`${API_URL}/mealplans/${mealPlan.id}/entries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ day: selectedSlot.day, mealType: selectedSlot.mealType, RecipeId: recipeId })
      });
      if (res.ok) {
        setShowModal(false);
        loadPlan();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeEntry = async (entryId) => {
    try {
      const res = await fetch(`${API_URL}/mealplans/${mealPlan.id}/entries/${entryId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        loadPlan();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getEntry = (day, mealType) => {
    return entries.find(e => e.day === day && e.mealType === mealType);
  };

  const changeWeek = (offset) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + offset * 7);
    setWeekStart(d.toISOString().split('T')[0]);
  };

  return (
    <div className="planner-page">
      <div className="container">
        <div className="planner-header">
          <h1>Planificateur</h1>
          <div className="divider"></div>
          <div className="week-nav">
            <button className="btn-week" onClick={() => changeWeek(-1)}>← Semaine précédente</button>
            <span className="week-label">Semaine du {new Date(weekStart).toLocaleDateString('fr-FR')}</span>
            <button className="btn-week" onClick={() => changeWeek(1)}>Semaine suivante →</button>
          </div>
          {!mealPlan && (
            <button className="btn-glow" style={{marginTop: '20px'}} onClick={createPlan}>
              Créer le plan de cette semaine
            </button>
          )}
        </div>

        {mealPlan && (
          <div className="planner-grid">
            <div className="grid-header">
              <div className="grid-cell header-cell"></div>
              {DAYS.map(day => (
                <div key={day} className="grid-cell header-cell">{DAY_LABELS[day]}</div>
              ))}
            </div>
            {MEALS.map(meal => (
              <div key={meal} className="grid-row">
                <div className="grid-cell meal-label">{MEAL_LABELS[meal]}</div>
                {DAYS.map(day => {
                  const entry = getEntry(day, meal);
                  return (
                    <div key={`${day}-${meal}`} className="grid-cell slot" onClick={() => !entry && openSlot(day, meal)}>
                      {entry ? (
                        <div className="slot-filled">
                          <span className="slot-recipe">{entry.Recipe?.name || 'Recette'}</span>
                          <button className="slot-remove" onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}>×</button>
                        </div>
                      ) : (
                        <span className="slot-empty">+</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Choisir une recette</h2>
            <p style={{textAlign: 'center', color: 'var(--text-light)', marginBottom: '20px', fontSize: '14px'}}>
              {DAY_LABELS[selectedSlot.day]} — {MEAL_LABELS[selectedSlot.mealType]}
            </p>
            <div className="recipe-select-list">
              {recipes.length === 0 && (
                <p style={{textAlign: 'center', color: 'var(--text-light)'}}>Aucune recette. Créez-en d'abord dans l'onglet Recettes.</p>
              )}
              {recipes.map(recipe => (
                <div key={recipe.id} className="recipe-select-item" onClick={() => assignRecipe(recipe.id)}>
                  <span className="recipe-select-name">{recipe.name}</span>
                  <span className="recipe-select-time">⏱ {recipe.prepTime} min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Planner;
