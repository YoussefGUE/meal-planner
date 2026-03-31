const MealPlanObserver = require('./MealPlanObserver');

class ShoppingListObserver extends MealPlanObserver {
  constructor() {
    super();
    this.shoppingList = {};
  }

  update(mealPlanEntries) {
    this.shoppingList = {};

    mealPlanEntries.forEach(entry => {
      if (entry.Recipe && entry.Recipe.RecipeIngredients) {
        entry.Recipe.RecipeIngredients.forEach(ri => {
          const name = ri.Ingredient.name;
          if (this.shoppingList[name]) {
            this.shoppingList[name].totalQuantity += ri.quantity;
          } else {
            this.shoppingList[name] = {
              ingredientName: name,
              totalQuantity: ri.quantity,
              unit: ri.unit || ri.Ingredient.defaultUnit,
              checked: false
            };
          }
        });
      }
    });

    return Object.values(this.shoppingList);
  }
}

module.exports = ShoppingListObserver;
