const {DataTypes} = require ('sequelize');

module.exports = (sequelize)=>{
const MealPlan = sequelize.define('MealPlan', {
id:{
	type:DataTypes.INTEGER,
	primaryKey:true,
	autoIncrement: true
},
weekStartDate:{
	type: DataTypes.DATE,
	allowNull: false
}
});
return MealPlan;
};
