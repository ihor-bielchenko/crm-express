'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
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
      orderId: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true,
      },
      actualOrderId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      clientOrderId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      totalAmount: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      orderType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      orderStatus: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dateCreated: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('orders');
  }
};
