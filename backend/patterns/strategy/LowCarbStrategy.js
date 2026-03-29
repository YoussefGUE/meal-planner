const DietStrategy = require('./DietStrategy');

class LowCarbStrategy extends DietStrategy {
	filterRecipes(recipes){
		return recipes.filter( recipe=> {
			const tags = JSON.parse(recipe.tags || '[]');
			return tags.includes('low-carb');
		});
	}
}

module.exports = LowCarbStrategy;
