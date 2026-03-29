const DietStrategy = require('./DietStrategy');

class GlutenFreeStrategy extends DietStrategy{
	filterRecipes(recipes){
		return recipes.filter( recipe => {
			const tags = JSON.parse(recipe.tags || '[]');
			return tags.includes('gluten-free');
		});
	}
}

module.exports = GlutenFreeStrategy;
