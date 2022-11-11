const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

const { dbConnection } = require('./database/config/db-config');
const { notFound } = require('./middlewares/handleError');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger');
dotenv.config();

const app = express();

//conexion postgresql
dbConnection();

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//enpoints
app.use('/auth', require('./routes/auth.routes'));
app.use('/user', require('./routes/user.routes'));
app.use('/rental', require('./routes/rental.routes'));
app.use('/movie', require('./routes/movie.routes'));
app.use('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, './views/home.html'));
});

app.use(notFound);

app.listen(process.env.PORT || 5000, () => {
  console.log('Server Listening in', process.env.PORT);
});

module.exports = app;
