'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    user.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        full_name: DataTypes.STRING,
        phone: DataTypes.STRING,
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false
        },
        created_by: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'user',
        underscored: true,
        scopes: {
            ownership: {
                attributes: ['full_name']
            }
        }
    });
    return user;
};