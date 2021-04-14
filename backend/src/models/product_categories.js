'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class product_categories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.product_categories.belongsTo(models.user, {
                foreignKey: 'created_by',
                as: 'creator_details'
            })
        }
    };
    product_categories.init({
        name: DataTypes.STRING,
        created_by: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'product_categories',
        underscored: true,
        scopes: {
            categoryDetails: {
                attributes: ['name']
            }
        }
    });
    return product_categories;
};