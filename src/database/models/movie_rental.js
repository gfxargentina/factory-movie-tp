const movieModel = require('../models').Movie;
const rentalModel = require('../models').Rental;
const userModel = require('../models').User;

('use strict');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie_Rental extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Movie_Rental.init(
    {
      rentalID: {
        type: DataTypes.INTEGER,
        references: {
          model: rentalModel,
          key: 'rental_id',
        },
      },
      movieID: {
        type: DataTypes.INTEGER,
        references: {
          model: movieModel,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Movie_Rental',
    }
  );
  return Movie_Rental;
};
