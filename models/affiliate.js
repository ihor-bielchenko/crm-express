'use strict';
const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Affiliate extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsToMany(models.Campaign, {
				through: 'affiliate_campaigns',
				as: 'campaigns',
				foreignKey: 'affId',
			});
			this.belongsTo(models.User, {
				as: 'user',
				foreignKey: 'userId',
			});
		}
	}
	Affiliate.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		userId: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		sourceId: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		clientSourceId: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		sourceTitle: {
			allowNull: false,
			type: DataTypes.STRING,
		},
	}, {
		sequelize,
		modelName: 'Affiliate',
		tableName: 'affiliates',
		imestamps: false,
	});
	return Affiliate;
};
