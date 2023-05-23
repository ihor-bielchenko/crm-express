const repository = require('./index.js');
const models = require('../models');

/**
 * @param {object} props
 * @return {object}
 */
const getOne = async function (props) {
	const request = await models.UserReferralRequest.findOne({where: { ...props }});
	if(!request){
		return null;
	}
	return request.dataValues;
};

/**
 * @param {object} props
 * @return {object}
 */
const remove = async function (props) {
	return models.UserReferralRequest.destroy({
		where: {
			...props
		}
	});
};

module.exports = ({
	getOne,
	remove,
});
