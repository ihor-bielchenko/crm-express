'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user_statuses', [
      {
        name: 'gold',
      },
      {
        name: 'silver',
      },
      {
        name: 'bronze',
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_statuses', null, {});
  }
};
