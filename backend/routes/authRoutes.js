const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../models');

const router = express.Router();

router.post('/register', async (req, res)=>{
try{
	const { username, email, password } = req.body;
	const existingUser = await User.findOne({ where: {email}});
	if (existingUser){
		return res.status(400).json({ message: 'Cet email est déjà utilisé' });
	}
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({username, email, passwordHash});
	const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'});
	res.status(201).json({token, user: {id: user.id, username: user.username, email: user.email}});
}catch (error){
	res.status(500).json({message: 'Erreur lors de l\'inscription', error: error.message});
}
});

router.post('/login', async (req, res)=>{
try{
	const {email, password} = req.body;
	const user = await User.findOne({where: { email}});
	if (!user){
		return res.status(400).json({ message: 'Email ou mot de passe incorrect'});
	}
	const isMatch = await bcrypt.compare(password, user.passwordHash);
	if(!isMatch){
		return res.status(400).json({ message: 'Email ou mot de passe incorrect'});
	}
	const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'});
	res.json({ token, user: {id: user.id, username: user.username, email: user.email}});
} catch (error){
	res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message});
}
});

module.exports = router;
