const RecipeAdapter = require('./RecipeAdapter');

class SpoonacularAdapter extends RecipeAdapter {
  adapt(data) {
    let instructions = '';
    if (data.analyzedInstructions && data.analyzedInstructions.length > 0) {
      instructions = data.analyzedInstructions[0].steps.map(s => `${s.number}. ${s.step}`).join(' ');
    } else if (data.instructions) {
      instructions = data.instructions.replace(/<[^>]*>/g, '');
    } else {
      instructions = 'Pas d\'instructions disponibles';
    }

    return {
      name: data.title,
      instructions: instructions,
      prepTime: data.readyInMinutes || 0,
      calories: data.nutrition ? data.nutrition.nutrients.find(n => n.name === 'Calories')?.amount : null,
      proteins: data.nutrition ? data.nutrition.nutrients.find(n => n.name === 'Protein')?.amount : null,
      carbs: data.nutrition ? data.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount : null,
      fats: data.nutrition ? data.nutrition.nutrients.find(n => n.name === 'Fat')?.amount : null,
      tags: JSON.stringify(data.diets || []),
      imageUrl: data.image || null,
      source: 'API',
      ingredients: (data.extendedIngredients || []).map(ing => ({
        name: ing.name,
        quantity: ing.amount,
        unit: ing.unit
      }))
    };
  }
}

module.exports = SpoonacularAdapter;
