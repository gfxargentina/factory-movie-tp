'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsToMany(models.Rental, {
        through: 'Movie_Rental',
        foreignKey: 'movieID',
      });
      Movie.belongsTo(models.User);
    }
  }

  Movie.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: DataTypes.STRING,
      stock: DataTypes.INTEGER,
      rentals: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Movie',
    }
  );
  return Movie;
};
