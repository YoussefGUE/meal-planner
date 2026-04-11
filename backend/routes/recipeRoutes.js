const express = require('express');
const {Recipe, RecipeIngredient, Ingredient } = require('../models');
const auth = require('../middleware/auth');
const VegetarianStrategy = require('../patterns/strategy/VegetarianStrategy');
const GlutenFreeStrategy = require('../patterns/strategy/GlutenFreeStrategy');
const LowCarbStrategy = require('../patterns/strategy/LowCarbStrategy');
const NoFilterStrategy = require('../patterns/strategy/NoFilterStrategy');
const SpoonacularAdapter = require('../patterns/adapter/SpoonacularAdapter');
const router = express.Router();

router.post('/', auth, async (req, res) => {
try{
const { name, instructions, prepTime, calories, proteins, carbs, fats, tags, imageUrl, source, ingredients } = req.body;
const recipe = await Recipe.create({
	name,
	instructions,
	prepTime,
	calories,
	proteins,
	carbs,
	fats,
	tags: JSON.stringify(tags || []),
	imageUrl,
	source,
	UserId: req.user.id
});

if (ingredients && ingredients.length > 0) {
  for (const ing of ingredients) {
    let ingredient = await Ingredient.findOne({ where: { name: ing.name } });
    if (!ingredient) {
      ingredient = await Ingredient.create({ name: ing.name, defaultUnit: ing.unit });
    }
    await RecipeIngredient.create({
      quantity: ing.quantity || 1,
      unit: ing.unit || '',
      RecipeId: recipe.id,
      IngredientId: ingredient.id
    });
  }
}

const fullRecipe = await Recipe.findByPk(recipe.id, {
  include: [{ model: RecipeIngredient, include: [Ingredient] }]
});

	res.status(201).json(fullRecipe);
} catch (error) {
	res.status(500).json({ message: 'Erreur lors de la création', error: error.message});
}
});

router.get('/', auth, async (req, res) => {
try{
	const recipes = await Recipe.findAll({ where: {UserId: req.user.id},
	include: [{ model: RecipeIngredient, include: [Ingredient]}]
	});
	res.json(recipes);
} catch (error) {
	res.status(500).json({ message: 'Erreur lors de la recuperation', error: error.message});
}
});

router.get('/filter/:diet', auth, async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: { UserId: req.user.id }
    });
    let strategy;
    switch (req.params.diet) {
      case 'vegetarian':
        strategy = new VegetarianStrategy();
        break;
      case 'gluten-free':
        strategy = new GlutenFreeStrategy();
        break;
      case 'low-carb':
        strategy = new LowCarbStrategy();
        break;
      default:
        strategy = new NoFilterStrategy();
    }
    const filtered = strategy.filterRecipes(recipes);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du filtrage', error: error.message });
  }
});

router.get('/search/:query', auth, async (req, res) => {
  try {
    const fetch = require('node-fetch');
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${req.params.query}&addRecipeInformation=true&addRecipeNutrition=true&fillIngredients=true&instructionsRequired=true&number=5&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    const data = await response.json();
    const adapter = new SpoonacularAdapter();
    const recipes = data.results.map(item => adapter.adapt(item));
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
try {
	const recipe = await Recipe.findByPk(req.params.id, {
		include: [{ model: RecipeIngredient, include: [Ingredient]}]
});
if(!recipe){
	return res.status(404).json({ message : 'Recette non trouve'});
}
	res.json(recipe);
} catch (error){
	res.status(500).json({ message: 'Erreur lors de la recuperation', error: error.message});
}
});

router.put('/:id', auth, async (req, res) => {
try{
	const recipe = await Recipe.findByPk(req.params.id);
	if(!recipe){
		return res.status(404).json({message: 'Recette non trouvee'});
	}
	if (recipe.UserId != req.user.id){
		return res.status(403).json({message: 'Non autorise a modifier cette recette'});
	}
	const { name, instructions, prepTime, calories, proteins, carbs, fats, tags, imageUrl } = req.body;
	await recipe.update({
		name,
		instructions,
		prepTime,
		calories,
		proteins,
		carbs,
		fats,
		tags: tags? JSON.stringify(tags) : recipe.tags,
		imageUrl
	});
	res.json(recipe);
	} catch(error){
		return res.status(500).json({ message: 'Erreur lors de la modification', error: error.message});
	}
});

router.delete('/:id', auth, async (req, res) => {
try{
	const recipe = await Recipe.findByPk(req.params.id);
	if (!recipe) {
		return res.status(404).json({message: 'Recette non trouvee'});
	}
	if(recipe.UserId != req.user.id){
		return res.status(403).json({ message: 'Non autorise a supprimer cette recette'});
	}
	await recipe.destroy();
	res.json({ message: 'Recette supprimee'});
} catch ( error){
	return res.status(500).json({message: 'Erreur lors de la suppression', error: error.message});
}
});

module.exports = router;
