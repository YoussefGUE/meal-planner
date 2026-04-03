const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const authService = {
  async register(username, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  }
};

export const recipeService = {
  async getAll() {
    const res = await fetch(`${API_URL}/recipes`, { headers: headers() });
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${API_URL}/recipes/${id}`, { headers: headers() });
    return res.json();
  },

  async create(recipe) {
    const res = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(recipe)
    });
    return res.json();
  },

  async update(id, recipe) {
    const res = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(recipe)
    });
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },

  async filter(diet) {
    const res = await fetch(`${API_URL}/recipes/filter/${diet}`, { headers: headers() });
    return res.json();
  },

  async search(query) {
    const res = await fetch(`${API_URL}/recipes/search/${query}`, { headers: headers() });
    return res.json();
  }
};

export const mealPlanService = {
  async create(weekStartDate) {
    const res = await fetch(`${API_URL}/mealplans`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ weekStartDate })
    });
    return res.json();
  },

  async getByWeek(weekStartDate) {
    const res = await fetch(`${API_URL}/mealplans/${weekStartDate}`, { headers: headers() });
    return res.json();
  },

  async addEntry(planId, day, mealType, RecipeId) {
    const res = await fetch(`${API_URL}/mealplans/${planId}/entries`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ day, mealType, RecipeId })
    });
    return res.json();
  },

  async removeEntry(planId, entryId) {
    const res = await fetch(`${API_URL}/mealplans/${planId}/entries/${entryId}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  }
};

export const shoppingService = {
  async getList(mealPlanId) {
    const res = await fetch(`${API_URL}/shopping/${mealPlanId}`, { headers: headers() });
    return res.json();
  }
};
