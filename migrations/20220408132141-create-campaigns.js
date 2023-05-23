'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      campaignId: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER,
      },
      campaignName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dateCreated: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('campaigns');
  }
};
