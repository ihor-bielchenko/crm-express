'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class AffiliateCampaign extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	AffiliateCampaign.init({
		affId: {
			type: DataTypes.INTEGER,
		},
		campaignId: {
			type: DataTypes.INTEGER,
		},
	}, {
		sequelize,
		tableName: 'affiliate_campaigns',
		modelName: 'AffiliateCampaign',
		imestamps: false,
	});
	return AffiliateCampaign;
};
