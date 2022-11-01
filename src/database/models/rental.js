'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rental extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Rental.init({
    rental_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
    rental_date: DataTypes.STRING,
    rental_expiry: DataTypes.STRING,
    total_cost: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Rental',
  });
  return Rental;
};