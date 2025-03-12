const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const swagger = require('./swagger/swagger');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Rotas
app.use('/api', userRoutes);
app.use('/api', profileRoutes);
app.use('/api', sessionRoutes);
// Documentação Swagger
swagger(app);

module.exports = app;