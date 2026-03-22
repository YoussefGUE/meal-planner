const {DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
const User = sequelize.define( 'User', {

id:{
	type: DataTypes.INTEGER,
	primaryKey: true,
	autoIncrement: true
},

username: {
	type: DataTypes.STRING,
	allowNull: false,
	unique: true
},

email: {
	type: DataTypes.STRING,
	allowNull: false,
	unique: true
},
passwordHash: {
	type: DataTypes.STRING,
	allowNull: false
},
allergies: {
	type: DataTypes.STRING,
	defaultValue: '[]'
}
});
return User;
};
