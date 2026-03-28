const express = require('express');
const {MealPlan, MealPlanEntry, Recipe} = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
try{
	const { weekStartDate } = req.body;

	const existingPlan = await MealPlan.findOne({
		where: {UserId: req.user.id, weekStartDate}
	});
	if(existingPlan){
		return res.status(400).json({message: 'Un plan existe deja pour cette semaine'});
	}

	const mealPlan = await MealPlan.create({
	weekStartDate,
	UserId: req.user.id});
	res.status(201).json(mealPlan);
} catch (error){
	res.status(500).json({ message: 'Erreur lors de la creation du plan', error: error.message});
}
});

router.get('/:weekStartDate', auth, async (req, res) =>{
try{
	const mealPlan = await MealPlan.findOne({
	where: { UserId: req.user.id, weekStartDate: req.params.weekStartDate},
	include: [{
	model: MealPlanEntry,
	include: [Recipe]
	}]
});

	if (!mealPlan){
		return res.status(404).json({message: 'Aucun plan trouve pour cette semaine'});
	}
	res.json(mealPlan);
} catch (error){
	res.status(500).json({ message: 'Erreur lors de la recuperation', error: error.message});
}
});

router.post('/:id/entries', auth, async (req, res) => {
try {
	const { day, mealType, RecipeId} = req.body;
	const mealPlan = await MealPlan.findByPk(req.params.id);
	if(!mealPlan){
		return res.status(404).json({message: 'Plan non trouve'});
	}
	const existingEntry = await MealPlanEntry.findOne({
		where: {MealPlanId: mealPlan.id, day, mealType}
	});

	if(existingEntry){
		await existingEntry.update({RecipeId});
		return res.json(existingEntry);
	}

	const entry = await MealPlanEntry.create({
	day,
	mealType,
	RecipeId,
	MealPlanId : mealPlan.id
	});
	res.status(201).json(entry);
} catch (error){
	res.status(500).json({ message: 'Erreur lors de l\'ajout du repas', error: error.message});
}
});
router.delete('/:id/entries/:entryId', auth, async (req, res) => {
try{
	const entry = await MealPlanEntry.findByPk(req.params.entryId);
	if (!entry){
		return res.status(404).json({message: 'Repas non trouve'});
	}
	await entry.destroy();
	res.json({message: 'Repas supprime du plan'});
} catch(error){
	res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message});
}
});

module.exports = router;
