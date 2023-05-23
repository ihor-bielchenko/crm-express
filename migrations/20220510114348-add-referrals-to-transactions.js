'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'transactions',
        'salaryPercent',
        {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 25,
        }
      ),
      queryInterface.addColumn(
        'transactions',
        'referralPercent',
        {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 10,
        }
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
     queryInterface.removeColumn('transactions', 'referralParentId'),
     queryInterface.removeColumn('transactions', 'referralPercent'),
    ]);
  }
};
