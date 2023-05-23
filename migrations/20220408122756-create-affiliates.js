'use strict';
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.createTable('affiliates', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			userId: {
				allowNull: true,
				defaultValue: null,
				type: Sequelize.INTEGER,
				references: {
					model: {
						tableName: 'users',
					},
					key: 'id'
				},
			},
			sourceId: {
				allowNull: false,
				unique: true,
				type: Sequelize.INTEGER,
			},
			clientSourceId: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING,
			},
			sourceTitle: {
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
		await queryInterface.dropTable('affiliates');
	}
};
