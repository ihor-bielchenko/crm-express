'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			email: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING,
			},
			phone: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			avatar: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			company: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			country: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			region: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			city: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			index: {
				allowNull: true,
				type: Sequelize.INTEGER,
			},
			address1: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			address2: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			messenger: {
				allowNull: true,
				type: Sequelize.INTEGER,
				defaultValue: 1,
			},
			nickname: {
				allowNull: false,
				type: Sequelize.STRING,
				defaultValue: ''
			},
			facebook: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			linkedin: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			emailVerifyKey: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			phoneVerifyKey: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			emailVerifiedAt: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			phoneVerifiedAt: {
				allowNull: true,
				type: Sequelize.DATE,
			},
			statusId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 1,
				references: {
					model: {
						tableName: 'user_statuses',
					},
					key: 'id'
				},
			},
			roleId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 1,
				references: {
					model: {
						tableName: 'user_roles',
					},
					key: 'id'
				},
			},
			verifyStatusId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 1,
				references: {
					model: {
						tableName: 'user_verify_statuses',
					},
					key: 'id'
				},
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
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('users');
	}
};
