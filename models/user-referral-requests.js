'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class UserReferralRequest extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
		}
	}
	UserReferralRequest.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		userId: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING,
		},
	}, {
		sequelize,
		modelName: 'UserReferralRequest',
		tableName: 'user_referral_requests',
		imestamps: true,
	});
	return UserReferralRequest;
};
