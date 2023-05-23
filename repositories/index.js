const errors = require('../core/errors.js');
const Sequelize = require('sequelize');

/**
 * @param {object} Model
 * @param {object} where
 * @return {object}
 */
const getOne = async function (Model, where = {}) {
	return await Model.findOne({ where });
};

/**
 * @param {object} Model
 * @param {object} where
 * @return {object}
 */
const getMany = async function (Model, where) {
	return await Model.findAll({ where });
};

/**
 * @param {object} Model
 * @param {object} query
 * @param {number} page
 * @param {number} countOnPage
 * @return {object}
 */
const paginate = async function (Model, query, page = 1, countOnPage = 15) {
	if(page < 1){
		page = 1;
	}

	if(countOnPage < 1){
		countOnPage = 15;
	}

	query = {
		...query,
		offset: (page - 1) * countOnPage,
		limit: countOnPage,
		distinct: true,
	};
	return Model.findAndCountAll(query);
};

/**
 * @param {object} Model
 * @return {object}
 */
const filter = async function (Model, props) {
	return {};
};

/**
 * @param {object} Model
 * @return {object}
 */
const search = async function (Model, props) {
	return {};
};

/**
 * @param {object} Model
 * @return {object}
 */
const sort = async function (Model, props) {
	return {};
};

/**
 * @param {object} Model
 * @param {object} props
 * @return {object}
 */
const create = async function (Model, props) {
	return await Model.create({ ...props });
};

/**
 * @param {object} Model
 * @param {number} id
 * @param {object} props
 * @return {object}
 */
const update = async function (Model, id, props) {
	try {
		return Model.update(
			{ ...props },
			{
				where: { id },
			});
	}
	catch (err) {
		throw new errors.RepositoryUpdate(err, props);
	}
};

/**
 * @param {object} Model
 * @param {object} ids
 * @return {object}
 */
const remove = async function (Model, ids = []) {
	return {};
};

/**
 * @param {object} Model
 * @param {object} where
 * @return {object}
 */
const count = async function (Model, where) {
	return await Model.count({ where });
};

/**
 * @param {object} Model
 * @param {object} query
 * @param {int} page
 * @param {int} countOnPage
 * @param {string} groupedColumn
 * @return {Promise<{countAll: int, data: Model[], countOnPage: int}>}
 */
const groupByPaginate = async function (Model, query, page = 1, countOnPage= 15, groupedColumn) {
	if(page < 1){
		page = 1;
	}

	if(countOnPage < 1){
		countOnPage = 15;
	}

	query.offset = (page - 1) * countOnPage;
	query.limit = countOnPage;
	let attributes = [[Sequelize.literal(`COUNT(DISTINCT(${groupedColumn}))`), 'count']];

	const countPromise = Model.count({
		attributes,
		include: query.include,
		where: query.where,
		having: query.having,
		distinct: true,
	});

	const dataPromise = Model.findAll(query);
	const result = await Promise.all([countPromise,  dataPromise]);
	const [
		count,
		data,
	] = result;

	return {
		count,
		data
	};
};

module.exports = ({
	getOne,
	getMany,
	groupByPaginate,
	filter,
	search,
	sort,
	create,
	update,
	remove,
	count,
	paginate,
});
