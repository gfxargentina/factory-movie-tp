const user = require('../models').User;

('use strict');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rental extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rental.belongsTo(models.User);
      Rental.belongsToMany(models.Movie, {
        through: 'Movie_Rental',
        foreignKey: 'rentalID',
      });
    }
  }
  Rental.init(
    {
      rental_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: user,
          key: 'id',
        },
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rental_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      refund_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userRefund_date: DataTypes.DATE,
      total_cost: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Rental',
    }
  );
  return Rental;
};
