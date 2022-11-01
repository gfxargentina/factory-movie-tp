const { Sequelize } = require('sequelize');

const dbConnection = async () => {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'postgres',
    }
  );
  try {
    await sequelize.authenticate();
    console.log('Sequelize connection has been established succesfully');
  } catch (error) {
    console.log('Unable to connect to the databse', error);
  }
};

module.exports = {
  dbConnection,
};
