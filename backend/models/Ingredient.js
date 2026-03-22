const { DataTypes } = require ('sequelize');

module.exports = (sequelize)=>{
const Ingredient = sequelize.define('Ingredient', {
id : {
	type: DataTypes.INTEGER,
	primaryKey: true,
	autoIncrement: true
},
name : {
	type: DataTypes.STRING,
	allowNull: false,
	unique: true
},
defaultUnit : {
	type: DataTypes.STRING,
	allowNull: true
}
});
return  Ingredient;
};
