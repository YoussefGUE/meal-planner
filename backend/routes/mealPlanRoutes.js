const express = require('express');
const { Op } = require('sequelize');
const { MealPlan, MealPlanEntry, Recipe } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { weekStartDate } = req.body;

    const plans = await MealPlan.findAll({
      where: { UserId: req.user.id }
    });

    const existingPlan = plans.find(p => {
      return p.weekStartDate.toISOString().split('T')[0] === weekStartDate;
    });

    if (existingPlan) {
      return res.status(400).json({ message: 'Un plan existe deja pour cette semaine' });
    }

    const mealPlan = await MealPlan.create({
      weekStartDate,
      UserId: req.user.id
    });

    res.status(201).json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la creation du plan', error: error.message });
  }
});

router.get('/:weekStartDate', auth, async (req, res) => {
  try {
    const plans = await MealPlan.findAll({
      where: { UserId: req.user.id },
      include: [{ model: MealPlanEntry, include: [Recipe] }]
    });

    const mealPlan = plans.find(p => {
      return p.weekStartDate.toISOString().split('T')[0] === req.params.weekStartDate;
    });

    if (!mealPlan) {
      return res.status(404).json({ message: 'Aucun plan trouve pour cette semaine' });
    }

    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recuperation', error: error.message });
  }
});

router.post('/:id/entries', auth, async (req, res) => {
  try {
    const { day, mealType, RecipeId } = req.body;

    const mealPlan = await MealPlan.findByPk(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Plan non trouve' });
    }

    const existingEntry = await MealPlanEntry.findOne({
      where: { MealPlanId: mealPlan.id, day, mealType }
    });

    if (existingEntry) {
      await existingEntry.update({ RecipeId });
      const updated = await MealPlanEntry.findByPk(existingEntry.id, { include: [Recipe] });
      return res.json(updated);
    }

    const entry = await MealPlanEntry.create({
      day,
      mealType,
      RecipeId,
      MealPlanId: mealPlan.id
    });

    const newEntry = await MealPlanEntry.findByPk(entry.id, { include: [Recipe] });
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du repas', error: error.message });
  }
});

router.delete('/:id/entries/:entryId', auth, async (req, res) => {
  try {
    const entry = await MealPlanEntry.findByPk(req.params.entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Repas non trouve' });
    }

    await entry.destroy();
    res.json({ message: 'Repas supprime du plan' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
});

module.exports = router;
