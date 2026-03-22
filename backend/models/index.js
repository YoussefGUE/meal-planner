const {Sequelize} = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: path.join(__dirname, '..', 'database.sqlite'),
	logging: false
});
const User = require('./User')(sequelize);
const Recipe = require('./Recipe')(sequelize);
const Ingredient = require('./Ingredient')(sequelize);
const RecipeIngredient = require('./RecipeIngredient')(sequelize);
const MealPlan = require('./MealPlan')(sequelize);
const MealPlanEntry = require('./MealPlanEntry')(sequelize);

User.hasMany(Recipe);
Recipe.belongsTo(User);
User.hasMany(MealPlan);
MealPlan.belongsTo(User);
Recipe.hasMany(RecipeIngredient);
RecipeIngredient.belongsTo(Recipe);
Ingredient.hasMany(RecipeIngredient);
RecipeIngredient.belongsTo(Ingredient);
MealPlan.hasMany(MealPlanEntry);
MealPlanEntry.belongsTo(MealPlan);
Recipe.hasMany(MealPlanEntry);
MealPlanEntry.belongsTo(Recipe);
module.exports = {sequelize, User, Recipe, Ingredient, RecipeIngredient, MealPlan, MealPlanEntry};
