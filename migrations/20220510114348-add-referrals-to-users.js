'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'users',
        'referralParentId',
        {
          allowNull: true,
          type: Sequelize.INTEGER,
          defaultValue: null,
          references: {
            model: {
              tableName: 'users',
            },
            key: 'id'
          },
        }
      ),
      queryInterface.addColumn(
        'users',
        'salaryPercent',
        {
          allowNull: false,
          type: Sequelize.INTEGER,
          defaultValue: 25,
        }
      ),
      queryInterface.addColumn(
        'users',
        'referralKey',
        {
          allowNull: false,
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        'users',
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
     queryInterface.removeColumn('users', 'referralParentId'),
     queryInterface.removeColumn('users', 'referralPercent'),
     queryInterface.removeColumn('users', 'salaryPercent'),
     queryInterface.removeColumn('users', 'referralKey'),
    ]);
  }
};
