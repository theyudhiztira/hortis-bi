'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            customer_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            amount_due: {
                type: Sequelize.INTEGER
            },
            discount: {
                type: Sequelize.INTEGER
            },
            date: {
                type: Sequelize.DATEONLY
            },
            created_by: {
                type: Sequelize.INTEGER
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('transactions');
    }
};