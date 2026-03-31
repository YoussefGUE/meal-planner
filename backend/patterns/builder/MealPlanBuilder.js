const { MealPlan, MealPlanEntry } = require('../../models');

class MealPlanBuilder {
  constructor() {
    this.userId = null;
    this.weekStartDate = null;
    this.meals = [];
  }

  setUser(userId) {
    this.userId = userId;
    return this;
  }

  setWeekStartDate(date) {
    this.weekStartDate = date;
    return this;
  }

  addMeal(day, mealType, recipeId) {
    this.meals.push({ day, mealType, RecipeId: recipeId });
    return this;
  }

  async build() {
    if (!this.userId || !this.weekStartDate) {
      throw new Error('UserId et weekStartDate sont obligatoires');
    }

    const mealPlan = await MealPlan.create({
      weekStartDate: this.weekStartDate,
      UserId: this.userId
    });

    for (const meal of this.meals) {
      await MealPlanEntry.create({
        day: meal.day,
        mealType: meal.mealType,
        RecipeId: meal.RecipeId,
        MealPlanId: mealPlan.id
      });
    }

    return mealPlan;
  }
}

module.exports = MealPlanBuilder;
