const MealPlanObserver = require('./MealPlanObserver');

class NutritionObserver extends MealPlanObserver {
  constructor() {
    super();
    this.weeklyNutrition = {};
  }

  update(mealPlanEntries) {
    this.weeklyNutrition = {
      totalCalories: 0,
      totalProteins: 0,
      totalCarbs: 0,
      totalFats: 0
    };

    mealPlanEntries.forEach(entry => {
      if (entry.Recipe) {
        this.weeklyNutrition.totalCalories += entry.Recipe.calories || 0;
        this.weeklyNutrition.totalProteins += entry.Recipe.proteins || 0;
        this.weeklyNutrition.totalCarbs += entry.Recipe.carbs || 0;
        this.weeklyNutrition.totalFats += entry.Recipe.fats || 0;
      }
    });

    return this.weeklyNutrition;
  }
}

module.exports = NutritionObserver;
