const { DataTypes } = require ('sequelize');
module.exports = (sequelize)=>{

const MealPlanEntry = sequelize.define('MealPlanEntry', {

id:{
	type: DataTypes.INTEGER,
	autoIncrement: true,
	primaryKey: true
},
day: {
	type: DataTypes.STRING,
	allowNull: false
},
mealType: {
	type: DataTypes.STRING,
	allowNull: false
}
});

return MealPlanEntry;
};
