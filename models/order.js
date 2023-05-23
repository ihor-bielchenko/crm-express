'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Order extends Model {
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
	Order.init({
		affId: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		campaignId: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		orderId: {
			type: DataTypes.STRING,
		},
		actualOrderId: {
			type: DataTypes.STRING,
		},
		clientOrderId: {
			type: DataTypes.STRING,
		},
		totalAmount: {
			allowNull: true,
			defaultValue: null,
			type: DataTypes.STRING,
		},
		orderType: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		orderStatus: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		dateCreated: {
			type: DataTypes.STRING,
			get() {
				return (this.getDataValue('dateCreated').split(" "))[0];
			}
		},
	}, {
		sequelize,
		modelName: 'Order',
		tableName: 'orders',
	});
	return Order;
}
