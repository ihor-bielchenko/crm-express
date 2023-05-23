'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('affiliate_campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      affId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'affiliates',
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      campaignId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'campaigns',
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    },{
      uniqueKeys: {
        actions_unique: {
          fields: ['affId', 'campaignId']
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('affiliate_campaigns');
  }

};
