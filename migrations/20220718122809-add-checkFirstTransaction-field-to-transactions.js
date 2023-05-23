'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'transactions',
        'checkFirstTransaction',
        {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        }
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('transactions', 'checkFirstTransaction'),
    ]);
  }
};
