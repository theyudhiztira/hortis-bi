'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.customer.belongsTo(models.user, {
                foreignKey: 'created_by',
                as: 'creator_details'
            })
        }
    };
    customer.init({
        full_name: DataTypes.STRING,
        phone: {
            type: DataTypes.STRING,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        created_by: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'customer',
        underscored: true,
    });
    return customer;
};