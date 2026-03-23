const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const {sequelize} = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => { res.json({message: 'Bienvenue sur l\'API MealPlanner'});
});

sequelize.sync().then(()=> {
	app.listen(PORT, ()=> {
		console.log(`Serveur lance sur le port ${PORT}`);
	});
});

module.exports = app;
