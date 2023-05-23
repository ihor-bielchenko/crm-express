'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'transactions',
        'clientOrderId',
        {
          allowNull: true,
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        'transactions',
        'itemStatus',
        {
          allowNull: true,
          type: Sequelize.STRING,
        }
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
     queryInterface.removeColumn('transactions', 'clientOrderId'),
     queryInterface.removeColumn('transactions', 'itemStatus'),
    ]);
  }
};
