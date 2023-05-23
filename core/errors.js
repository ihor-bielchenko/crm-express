
/**
 * @param {string} message
 * @param {number} statusCode
 */
const Base = function (err = {}, message, statusCode) {
	this.name = 'ErrorBase';
	this.message = `${err.message || 'system error'} : ${message || 'ErrorBase'}`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 500;
};

/**
 * @param {string} message
 * @param {number} statusCode
 */
const EncryptPassword = function (err = {}, message, statusCode) {
	this.name = 'EncryptPassword';
	this.message = `${err.message || 'system error'} : ${message || 'EncryptPassword'}`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 500;
};

/**
 * @param {string} message
 * @param {number} statusCode
 */
const CheckPassword = function (err = {}, message, statusCode) {
	this.name = 'CheckPassword';
	this.message = `${err.message || 'system error'} : ${message || 'CheckPassword'}`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 500;
};

/**
 * @param {string} message
 * @param {number} statusCode
 */
const RepositoryCreate = function (err = {}, props, statusCode) {
	this.name = 'RepositoryCreate';
	this.message = `${err.message || 'system error'} : RepositoryCreate`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 500;
	this.props = props;
};

/**
 * @param {string} message
 * @param {number} statusCode
 */
const RepositoryUpdate = function (err = {}, props, statusCode) {
	this.name = 'RepositoryUpdate';
	this.message = `${err.message || 'system error'} : RepositoryUpdate`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 500;
	this.props = props;
};

/**
 * @param {string} message
 * @param {number} statusCode
 */
const RepositoryRemove = function (err = {}, props, statusCode) {
	this.name = 'RepositoryRemove';
	this.message = `${err.message || 'system error'} : RepositoryRemove`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 500;
	this.props = props;
};

/**
 * @param {object} props
 * @param {number} statusCode
 */
const RepositoryModelNotFound = function (props = {}, statusCode) {
	this.name = 'RepositoryModelNotFound';
	this.message = 'Model not found : '+ JSON.stringify(props);
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 404;
	this.props = props;
};

/**
 * @param {string} message
 * @param {number} statusCode
 */
const RepositoryPaginate = function (err = {}, props, statusCode) {
	this.name = 'RepositoryPaginate';
	this.message = `${err.message || 'system error'} : RepositoryPaginate`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 500;
	this.props = props;
};

/**
 * @param {string} message
 * @param {number} statusCode
 */
const RepositoryFilter = function (err = {}, props, statusCode) {
	this.name = 'RepositoryFilter';
	this.message = `${err.message || 'system error'} : RepositoryFilter`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 500;
	this.props = props;
};

/**
 * @param {string} message
 * @param {number} statusCode
 */
const RepositorySearch = function (err = {}, props, statusCode) {
	this.name = 'RepositorySearch';
	this.message = `${err.message || 'system error'} : RepositorySearch`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 500;
	this.props = props;
};

/**
 * @param {string} message
 * @param {number} statusCode
 */
const RepositorySort = function (err = {}, props, statusCode) {
	this.name = 'RepositorySort';
	this.message = `${err.message || 'system error'} : RepositorySort`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 500;
	this.props = props;
};

/**
 * @param {object} err
 * @param {object} props
 * @param {number} statusCode
 */
const BadRequest = function (err = {}, props = {}, statusCode) {
	this.name = 'BadRequest';
	this.message = `${err.message || 'system error'} : BadRequest`;
	this.stack = (new Error()).stack;
	this.statusCode = statusCode ?? 400;
	this.props = props;
};

Base.prototype = Object.create(Error.prototype);
Base.prototype.constructor = Base;

EncryptPassword.prototype = Object.create(Base.prototype);
EncryptPassword.prototype.constructor = EncryptPassword;

CheckPassword.prototype = Object.create(Base.prototype);
CheckPassword.prototype.constructor = CheckPassword;

RepositoryCreate.prototype = Object.create(Base.prototype);
RepositoryCreate.prototype.constructor = RepositoryCreate;

RepositoryUpdate.prototype = Object.create(Base.prototype);
RepositoryUpdate.prototype.constructor = RepositoryUpdate;

RepositoryRemove.prototype = Object.create(Base.prototype);
RepositoryRemove.prototype.constructor = RepositoryRemove;

RepositoryModelNotFound.prototype = Object.create(Base.prototype);
RepositoryModelNotFound.prototype.constructor = RepositoryModelNotFound;

RepositoryPaginate.prototype = Object.create(Base.prototype);
RepositoryPaginate.prototype.constructor = RepositoryPaginate;

RepositoryFilter.prototype = Object.create(Base.prototype);
RepositoryFilter.prototype.constructor = RepositoryFilter;

RepositorySearch.prototype = Object.create(Base.prototype);
RepositorySearch.prototype.constructor = RepositorySearch;

RepositorySort.prototype = Object.create(Base.prototype);
RepositorySort.prototype.constructor = RepositorySort;

BadRequest.prototype = Object.create(Base.prototype);
BadRequest.prototype.constructor = BadRequest;


module.exports = ({
	Base,
	EncryptPassword,
	CheckPassword,
	RepositoryCreate,
	RepositoryUpdate,
	RepositoryRemove,
	RepositoryModelNotFound,
	RepositoryPaginate,
	RepositoryFilter,
	RepositorySearch,
	RepositorySort,
	BadRequest,
});
