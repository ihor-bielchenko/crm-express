'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasOne(models.Affiliate, {
				as: 'affiliate',
				foreignKey: 'userId',
			});

			this.hasMany(models.User, {
				as: 'referrals',
				foreignKey: 'referralParentId',
			});
			this.belongsTo(models.UserStatus, {
				as: 'status',
				foreignKey: 'statusId',
			});
		}
	}
	User.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		phone: {
			type: DataTypes.STRING,
		},
		avatar: {
			type: DataTypes.STRING,
		},
		company: {
			type: DataTypes.STRING,
		},
		country: {
			type: DataTypes.STRING,
		},
		region: {
			type: DataTypes.STRING,
		},
		city: {
			type: DataTypes.STRING,
		},
		index: {
			type: DataTypes.INTEGER,
		},
		address1: {
			type: DataTypes.STRING,
		},
		address2: {
			type: DataTypes.STRING,
		},
		messenger: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		nickname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		facebook: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		linkedin: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		emailVerifyKey: {
			type: DataTypes.STRING,
		},
		phoneVerifyKey: {
			type: DataTypes.STRING,
		},
		emailVerifiedAt: {
			type: DataTypes.DATE,
		},
		phoneVerifiedAt: {
			type: DataTypes.DATE,
		},
		statusId: {
			type: DataTypes.INTEGER,
		},
		roleId: {
			type: DataTypes.INTEGER,
		},
		verifyStatusId: {
			type: DataTypes.INTEGER,
		},
		salaryPercent: {
			type: DataTypes.INTEGER,
		},
		referralKey: {
			type: DataTypes.STRING,
		},
		referralPercent: {
			type: DataTypes.INTEGER,
		},
		shavePercent: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
	}, {
		sequelize,
		modelName: 'User',
		tableName: 'users',
	});
	return User;
};
