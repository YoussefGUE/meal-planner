const jwt = require('jsonwebtoken');
const { User} = require('../models');

const auth = async (req, res, next) => {
try{
	const token = req.header('Authorization').replace('Bearer ', '');
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	const user = await User.findByPk(decoded.id);

	if(!user) {
		return res.status(401).json({ message: 'Non autorisé' });
	}
	req.user = user;
	next();
}catch(error){
	res.status(401).json({ message: 'Non autorisé' });
}
};

module.exports = auth;
