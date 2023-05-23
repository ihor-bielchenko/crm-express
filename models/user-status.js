'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class UserStatus extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
		}
	}
	UserStatus.init({
		name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
	}, {
		sequelize,
		modelName: 'UserStatus',
		tableName: 'user_statuses',
		timestamps: false,
	});
	return UserStatus;
};
