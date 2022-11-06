'use strict';

const movie = require('../models').Movie;
const user = require('../models').User;

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FavoriteMovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      FavoriteMovie.hasMany(models.Movie, {
        foreignKey: 'id',
      });
      FavoriteMovie.hasMany(models.User, {
        foreignKey: 'id',
      });
    }
  }
  FavoriteMovie.init(
    {
      MovieCode: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
          model: movie,
          key: 'id',
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: user,
          key: 'id',
        },
      },
      review: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'FavoriteMovie',
    }
  );
  return FavoriteMovie;
};
