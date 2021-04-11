'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction_items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  transaction_items.init({
    transaction_id: DataTypes.INTEGER,
    product: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaction_items',
    underscored: true,
  });
  return transaction_items;
};