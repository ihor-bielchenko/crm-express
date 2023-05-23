'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'users',
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
      queryInterface.removeColumn('users', 'checkFirstTransaction'),
    ]);
  }
};
