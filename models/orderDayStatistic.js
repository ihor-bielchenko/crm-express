'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class OrderDayStatistic extends Model {
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
	OrderDayStatistic.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		affId: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		campaignId: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		totalAmount: {
			allowNull: true,
			defaultValue: null,
			type: DataTypes.STRING,
		},
		rebillsAmount: {
			type: DataTypes.STRING,
		},
		affRebillsAmount: {
			type: DataTypes.STRING,
		},
		affAmount: {
			type: DataTypes.STRING,
		},
		referralAmount: {
			type: DataTypes.STRING,
		},
		companyAmount: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		affOriginAmount: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		referralOriginAmount: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		companyOriginAmount: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		newSaleCompleteCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		newSaleCanceledCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		newSaleRefundedCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		newSaleDeclinedCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		recurringCompleteCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		recurringCanceledCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		recurringRefundedCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		recurringDeclinedCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},


		newSaleCompleteOriginCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		newSaleCanceledOriginCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		newSaleRefundedOriginCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		newSaleDeclinedOriginCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		recurringCompleteOriginCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		recurringCanceledOriginCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		recurringRefundedOriginCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		recurringDeclinedOriginCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		dateCreated: {
			type: DataTypes.STRING,
		},
	}, {
		sequelize,
		modelName: 'OrderDayStatistic',
		tableName: 'order_day_statistic',
		freezeTableName: true
	});
	return OrderDayStatistic;
};
