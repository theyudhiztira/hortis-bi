'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class production_details extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.production_details.belongsTo(models.productions, {
                foreignKey: 'production_id',
                as: 'production_ht'
            })
            models.production_details.belongsTo(models.product_entries, {
                foreignKey: 'product',
                as: 'product_details'
            })
        }
    };
    production_details.init({
        production_id: DataTypes.INTEGER,
        product: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        unit: DataTypes.STRING,
        created_by: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'production_details',
        underscored: true,
    });
    return production_details;
};