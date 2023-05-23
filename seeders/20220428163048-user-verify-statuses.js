'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user_verify_statuses', [
      {
        name: 'new request',
      },
      {
        name: 'approved',
      },
      {
        name: 'canceled',
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_verify_statuses', null, {});
  }
};
