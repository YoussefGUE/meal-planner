const { DataTypes } = require ( 'sequelize' );

module.exports = (sequelize) => {
const Recipe = sequelize.define('Recipe', {

id: {
	type: DataTypes.INTEGER,
	primaryKey: true,
	autoIncrement: true,
},
name: {
	type: DataTypes.STRING,
	allowNull: false
},
instructions: {
	type: DataTypes.TEXT,
	allowNull: false
},
prepTime: {
	type: DataTypes.INTEGER,
	allowNull: false
},
calories: {
	type: DataTypes.FLOAT,
	allowNull: true
},
proteins: {
	type: DataTypes.FLOAT,
	allowNull: true
},
carbs: {
	type: DataTypes.FLOAT,
	allowNull: true
},
fats: {
	type: DataTypes.FLOAT,
	allowNull: true
},
tags: {
	type: DataTypes.STRING,
	defaultValue: '[]'
},
imageUrl: {
	type: DataTypes.STRING,
	allowNull: true
},
source: {
	type: DataTypes.STRING,
	defaultValue: 'LOCAL'
}
});
return Recipe;
};
