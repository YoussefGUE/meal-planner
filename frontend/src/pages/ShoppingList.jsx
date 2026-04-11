import { useState, useEffect } from 'react';

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

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [weekStart] = useState(getMonday(new Date()));

  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = async () => {
    try {
      const plansRes = await fetch(`${API_URL}/mealplans/${weekStart}`, {
        headers: getHeaders()
      });

      if (!plansRes.ok) {
        setMessage('Aucun plan trouvé pour cette semaine. Créez un plan dans le Planificateur.');
        setLoading(false);
        return;
      }

      const plan = await plansRes.json();

      const shoppingRes = await fetch(`${API_URL}/shopping/${plan.id}`, {
        headers: getHeaders()
      });

      if (shoppingRes.ok) {
        const data = await shoppingRes.json();
        setItems(data.map(item => ({ ...item, checked: false })));
      } else {
        setMessage('Erreur lors de la génération de la liste');
      }
    } catch (err) {
      setMessage('Erreur lors du chargement');
    }
    setLoading(false);
  };

  const toggleItem = (index) => {
    const updated = [...items];
    updated[index].checked = !updated[index].checked;
    setItems(updated);
  };

  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="shopping-page">
      <div className="container">
        <div className="shopping-header">
          <h1>Liste de Courses</h1>
          <div className="divider"></div>
          <p className="shopping-week">Semaine du {new Date(weekStart).toLocaleDateString('fr-FR')}</p>
          {items.length > 0 && (
            <p className="shopping-progress">{checkedCount} / {items.length} articles cochés</p>
          )}
        </div>

        {loading && <p className="shopping-message">Chargement...</p>}
        {message && <p className="shopping-message">{message}</p>}

        {items.length > 0 && (
          <div className="shopping-list">
            {items.map((item, index) => (
              <div
                key={index}
                className={`shopping-item ${item.checked ? 'checked' : ''}`}
                onClick={() => toggleItem(index)}
              >
                <div className="checkbox">{item.checked ? '✓' : ''}</div>
                <span className="item-name">{item.ingredientName}</span>
                <span className="item-quantity">{item.totalQuantity} {item.unit || ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingList;
