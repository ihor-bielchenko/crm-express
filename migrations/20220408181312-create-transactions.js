'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      affId: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'affiliates',
          },
          key: 'id'
        },
      },
      campaignId: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'campaigns',
          },
          key: 'id'
        },
      },
      transactionId: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      orderId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      totalAmount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      billingCycleNumber: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      responseType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      product: {
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
    await queryInterface.dropTable('transactions');
  }
};
