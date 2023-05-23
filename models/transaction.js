'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Transaction extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Affiliate, {
				as: 'affiliate',
				foreignKey: 'affId',
			});
			this.belongsTo(models.Campaign, {
				as: 'campaign',
				foreignKey: 'campaignId',
			});
		}
	}
	Transaction.init({
		affId: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		campaignId: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		transactionId: {
			type: DataTypes.STRING,
		},
		orderId: {
			type: DataTypes.STRING,
		},
		totalAmount: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		billingCycleNumber: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		responseType: {
			type: DataTypes.STRING,
		},
		product: {
			type: DataTypes.STRING,
		},
		dateCreated: {
			type: DataTypes.DATE,
		},
		salaryPercent: {
			type: DataTypes.INTEGER,
		},
		referralPercent: {
			type: DataTypes.INTEGER,
		},
		clientOrderId: {
			type: DataTypes.STRING,
		},
		itemStatus: {
			type: DataTypes.STRING,
		},
		checkFirstTransaction: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
		},
	}, {
		sequelize,
		modelName: 'Transaction',
		tableName: 'transactions',
		imestamps: false,
	});
	return Transaction;
};
