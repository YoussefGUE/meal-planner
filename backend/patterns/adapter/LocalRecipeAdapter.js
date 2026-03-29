const RecipeAdapter = require('./RecipeAdapter');

class LocalRecipeAdapter extends RecipeAdapter {
  adapt(data) {
    return {
      name: data.name,
      instructions: data.instructions,
      prepTime: data.prepTime,
      calories: data.calories || null,
      proteins: data.proteins || null,
      carbs: data.carbs || null,
      fats: data.fats || null,
      tags: JSON.stringify(data.tags || []),
      imageUrl: data.imageUrl || null,
      source: 'LOCAL',
      ingredients: (data.ingredients || []).map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit
      }))
    };
  }
}

module.exports = LocalRecipeAdapter;
