'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class product_sub_categories extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
          
        }
    };
    product_sub_categories.init({
      category_id: DataTypes.INTEGER,
      name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'product_sub_categories',
        underscored: true,
        scopes: {
            subCategoryDetails: {
                attributes: ['name']
            }
        },
        timestamps: false
    });
    return product_sub_categories;
};