'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Campaign extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.Transaction, {
				as: 'transactions',
				foreignKey: 'campaignId',
			});
			this.belongsToMany(models.Affiliate, {
				through: 'affiliate_campaigns',
				as: 'affiliate',
				foreignKey: 'campaignId',
			});
		}
	}
	Campaign.init({
		campaignId: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		campaignName: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		dateCreated: {
			type: DataTypes.DATE,
		},
	}, {
		sequelize,
		modelName: 'Campaign',
		tableName: 'campaigns',
		imestamps: false,
	});
	return Campaign;
};
