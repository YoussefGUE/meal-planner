const { DataTypes } = require ('sequelize');

module.exports = (sequelize)=>{
const RecipeIngredient = sequelize.define('RecipeIngredient', {
id:{
	type:DataTypes.INTEGER,
	primaryKey: true,
	autoIncrement: true
},
quantity:{
	type:DataTypes.FLOAT,
	allowNull: false,
},
unit: {
	type:DataTypes.STRING,
	allowNull: true
}
});

return RecipeIngredient;};
