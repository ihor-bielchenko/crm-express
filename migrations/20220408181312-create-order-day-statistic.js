'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('order_day_statistic', {
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
      totalAmount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rebillsAmount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      affRebillsAmount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      affAmount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      referralAmount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      companyAmount: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      affOriginAmount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      referralOriginAmount: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      companyOriginAmount: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      newSaleCompleteCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      newSaleCanceledCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      newSaleRefundedCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      newSaleDeclinedCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      recurringCompleteCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      recurringCanceledCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      recurringRefundedCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      recurringDeclinedCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },




      newSaleCompleteOriginCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      newSaleCanceledOriginCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      newSaleRefundedOriginCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      newSaleDeclinedOriginCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },

      recurringCompleteOriginCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      recurringCanceledOriginCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      recurringRefundedOriginCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      recurringDeclinedOriginCount: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    }, {
     uniqueKeys: {
       actions_unique: {
         fields: ['dateCreated', 'campaignId','affId']
       }
     },
   });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('order_day_statistic');
  }
};
