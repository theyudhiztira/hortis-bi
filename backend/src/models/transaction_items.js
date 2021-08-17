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
            models.transaction_items.belongsTo(models.product_entries, {
                foreignKey: 'product',
                as: 'product_details'
            })
        }
    };
    transaction_items.init({
        transaction_id: DataTypes.INTEGER,
        product: DataTypes.INTEGER,
        price: DataTypes.DECIMAL(16,4),
        pricing_type: DataTypes.STRING,
        quantity: DataTypes.INTEGER,
        created_by: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'transaction_items',
        underscored: true,
    });
    return transaction_items;
};