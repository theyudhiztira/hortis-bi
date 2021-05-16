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
            models.transactions.hasMany(models.transaction_items, {
                foreignKey: 'transaction_id',
                require: true,
                as: 'items'
            })
            models.transactions.belongsTo(models.user, {
                foreignKey: 'created_by',
                as: 'creator_details'
            })
            models.transactions.hasOne(models.customer, {
                sourceKey: 'customer_id',
                foreignKey: 'id',
                as: 'customer_details'
            })
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
        date: DataTypes.DATEONLY,
        created_by: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'transactions',
        underscored: true,
    });
    return transactions;
};