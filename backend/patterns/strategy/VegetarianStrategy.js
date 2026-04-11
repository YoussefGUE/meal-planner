const DietStrategy = require('./DietStrategy');

class VegetarianStrategy extends DietStrategy {
  filterRecipes(recipes) {
    return recipes.filter(recipe => {
      const tags = JSON.parse(recipe.tags || '[]');
      return tags.some(tag => tag.toLowerCase().includes('vegetarian') || tag.toLowerCase().includes('vegan'));
    });
  }
}

module.exports = VegetarianStrategy;
