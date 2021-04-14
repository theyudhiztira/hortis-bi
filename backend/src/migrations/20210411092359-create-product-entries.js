'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('product_entries', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            category_id: {
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            unit: {
                type: Sequelize.ENUM('pcs', 'kg', 'ltr'),
                allowNull: false
            },
            price_per_unit_retail: Sequelize.INTEGER,
            price_per_unit_reseller: Sequelize.INTEGER,
            stock: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            status: {
                type: Sequelize.ENUM('0', '1'),
                defaultValue: '1',
                allowNull: true,
                comment: '0 = disabled, 1 = active'
            },
            is_unlimited: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: true
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
        await queryInterface.dropTable('product_entries');
    }
};