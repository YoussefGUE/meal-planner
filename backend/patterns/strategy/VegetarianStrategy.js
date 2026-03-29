const DietStrategy = require('./DietStrategy');

class VegetarianStrategy extends DietStrategy{
	filterRecipes(recipes){
		return recipes.filter( recipe => {
			const tags = JSON.parse(recipe.tags || '[]');
			return tags.includes('vegetarian');
		});
	}
}

module.exports = VegetarianStrategy;
