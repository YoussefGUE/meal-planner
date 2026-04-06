const DietStrategy = require('./DietStrategy');

class GlutenFreeStrategy extends DietStrategy {
  filterRecipes(recipes) {
    return recipes.filter(recipe => {
      const tags = JSON.parse(recipe.tags || '[]');
      return tags.some(tag => tag.toLowerCase().includes('gluten'));
    });
  }
}

module.exports = GlutenFreeStrategy;
