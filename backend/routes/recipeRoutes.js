const express = require('express');
const {Recipe, RecipeIngredient, Ingredient } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
try{
const { name, instructions, prepTime, calories, proteins, carbs, fats, tags, imageUrl, source} = req.body;
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
	res.status(201).json(recipe);
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
