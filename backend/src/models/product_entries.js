'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class product_entries extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.product_entries.belongsTo(models.user, {
                foreignKey: 'created_by',
                as: 'creator_details'
            })
            models.product_entries.belongsTo(models.product_categories, {
                foreignKey: 'category_id',
                as: 'category_details'
            })
        }
    };
    product_entries.init({
        category_id: DataTypes.INTEGER,
        name: DataTypes.STRING,
        unit: {
            type: DataTypes.ENUM('pcs', 'kg', 'ltr'),
            allowNull: false
        },
        price_per_unit_retail: DataTypes.INTEGER,
        price_per_unit_reseller: DataTypes.INTEGER,
        stock: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('0', '1'),
            defaultValue: '1',
            allowNull: true,
            comment: '0 = disabled, 1 = active'
        },
        is_unlimited: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        created_by: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'product_entries',
        underscored: true,
    });
    return product_entries;
};