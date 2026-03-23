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
