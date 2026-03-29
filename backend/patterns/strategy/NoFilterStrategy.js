const DietStrategy = require('./DietStrategy');

class NoFilterStrategy extends DietStrategy{
	filterRecipes(recipes){
		return recipes;
	}
}

module.exports = NoFilterStrategy;
