'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class productions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.productions.hasMany(models.production_details, {
                foreignKey: 'production_id',
                require: true,
                as: 'items'
            })
            models.productions.belongsTo(models.user, {
                foreignKey: 'created_by',
                as: 'creator_details'
            })
            models.productions.belongsTo(models.customer, {
                foreignKey: 'supplier',
                as: 'supplier_details'
            })
        }
    };
    productions.init({
        date: DataTypes.DATEONLY,
        supplier: DataTypes.INTEGER,
        created_by: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: 'production',
        modelName: 'productions',
        underscored: true,
    });
    return productions;
};