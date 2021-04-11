'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class transactions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    transactions.init({
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        amount_due: DataTypes.INTEGER,
        discount: DataTypes.INTEGER,
        created_by: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'transactions',
        underscored: true,
    });
    return transactions;
};