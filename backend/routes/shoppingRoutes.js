const express = require('express');
const {MealPlan, MealPlanEntry, Recipe, RecipeIngredient, Ingredient} = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:mealPlanId', auth, async (req, res) => {
try{
	const mealPlan = await MealPlan.findByPk(req.params.mealPlanId, {
	include: [{ model: MealPlanEntry, include: [{ model: Recipe, include: [{ model: RecipeIngredient, include: [Ingredient] }] }] }] });
	if (!mealPlan) {
		return res.status(404).json({ message: 'Plan non trouve' });
	}

	const shoppingList = {};

	mealPlan.MealPlanEntries.forEach(entry => {
        if (entry.Recipe && entry.Recipe.RecipeIngredients) {
        entry.Recipe.RecipeIngredients.forEach(ri => {
          const name = ri.Ingredient.name;
          if (shoppingList[name]) {
            shoppingList[name].totalQuantity += ri.quantity;
          } else {
            shoppingList[name] = {
              ingredientName: name,
              totalQuantity: ri.quantity,
              unit: ri.unit || ri.Ingredient.defaultUnit,
              checked: false
            };
          }
        });
      }
    });
	res.json(Object.values(shoppingList));
} catch (error){
	res.status(500).json({ message: 'Erreur lors de la generation', error: error.message});
}
});

module.exports = router;
