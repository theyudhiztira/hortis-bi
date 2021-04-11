'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         * 
         */

        await queryInterface.bulkInsert('users', [{
            id: 1,
            email: 'devteam@dipandu.id',
            password: '$2a$10$v8Ie7Xfth7gI0zwMLVoFzu2CHsay3HNKHXeKeJ7YDu2r5nwf5jwBK',
            phone: '085155001616',
            full_name: 'Innovation Lab',
            avatar: null,
            role: 'admin',
            created_by: 1,
            created_at: '2021-02-18 00:00:00',
            updated_at: '2021-02-18 00:00:00',
        }])

        await queryInterface.bulkInsert('product_categories', [{
            id: 1,
            name: 'Buah',
            created_by: 1,
            created_at: '2021-02-18 00:00:00',
            updated_at: '2021-02-18 00:00:00',
        },{
            id: 2,
            name: 'Bibit',
            created_by: 1,
            created_at: '2021-02-18 00:00:00',
            updated_at: '2021-02-18 00:00:00',
        },{
            id: 3,
            name: 'Kuliner',
            created_by: 1,
            created_at: '2021-02-18 00:00:00',
            updated_at: '2021-02-18 00:00:00',
        },{
            id: 4,
            name: 'Wahana',
            created_by: 1,
            created_at: '2021-02-18 00:00:00',
            updated_at: '2021-02-18 00:00:00',
        }])

        await queryInterface.bulkInsert('product_entries', [
            {
                "id": 1,
                "category_id": 1,
                "name": "Belimbing",
                "unit": "pcs",
                "price_per_unit_retail": 3700,
                "price_per_unit_reseller": 3000,
                "stock": 100,
                "status": "1",
                "is_unlimited": true,
                "created_by": 1,
                "created_at": "2021-04-11T19:31:36.000Z",
                "updated_at": "2021-04-11T19:31:36.000Z",
            },
            {
                "id": 2,
                "category_id": 1,
                "name": "Jambu",
                "unit": "pcs",
                "price_per_unit_retail": 4000,
                "price_per_unit_reseller": 4500,
                "stock": 100,
                "status": "1",
                "is_unlimited": true,
                "created_by": 1,
                "created_at": "2021-04-11T19:31:51.000Z",
                "updated_at": "2021-04-11T19:31:51.000Z",
            },
            {
                "id": 3,
                "category_id": 1,
                "name": "Kiwi",
                "unit": "pcs",
                "price_per_unit_retail": 9700,
                "price_per_unit_reseller": 9000,
                "stock": 100,
                "status": "1",
                "is_unlimited": true,
                "created_by": 1,
                "created_at": "2021-04-11T19:32:03.000Z",
                "updated_at": "2021-04-11T19:32:03.000Z",
            },
            {
                "id": 4,
                "category_id": 3,
                "name": "Bakso Telur",
                "unit": "pcs",
                "price_per_unit_retail": 12000,
                "price_per_unit_reseller": 0,
                "stock": 100,
                "status": "1",
                "is_unlimited": true,
                "created_by": 1,
                "created_at": "2021-04-11T19:32:30.000Z",
                "updated_at": "2021-04-11T19:32:30.000Z",
            },
            {
                "id": 5,
                "category_id": 3,
                "name": "Rawon",
                "unit": "pcs",
                "price_per_unit_retail": 18000,
                "price_per_unit_reseller": 0,
                "stock": 100,
                "status": "1",
                "is_unlimited": true,
                "created_by": 1,
                "created_at": "2021-04-11T19:32:40.000Z",
                "updated_at": "2021-04-11T19:32:40.000Z",
            },
            {
                "id": 6,
                "category_id": 3,
                "name": "Nasi Putih",
                "unit": "pcs",
                "price_per_unit_retail": 3000,
                "price_per_unit_reseller": 0,
                "stock": 0,
                "status": "1",
                "is_unlimited": true,
                "created_by": 1,
                "created_at": "2021-04-11T19:32:55.000Z",
                "updated_at": "2021-04-11T19:32:55.000Z",
            },
            {
                "id": 7,
                "category_id": 4,
                "name": "ATV",
                "unit": "pcs",
                "price_per_unit_retail": 55000,
                "price_per_unit_reseller": 0,
                "stock": 0,
                "status": "1",
                "is_unlimited": true,
                "created_by": 1,
                "created_at": "2021-04-11T19:33:31.000Z",
                "updated_at": "2021-04-11T19:33:31.000Z",
            },
            {
                "id": 8,
                "category_id": 4,
                "name": "Flying Fox",
                "unit": "pcs",
                "price_per_unit_retail": 45000,
                "price_per_unit_reseller": 0,
                "stock": 0,
                "status": "1",
                "is_unlimited": true,
                "created_by": 1,
                "created_at": "2021-04-11T19:33:45.000Z",
                "updated_at": "2021-04-11T19:33:45.000Z",
            }
        ])
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};