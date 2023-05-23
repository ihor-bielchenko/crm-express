
/**
 * @param {string} newMessage
 * @return {object}
 */
const setMessage = function (newMessage = '') {
	this._content.message = String(newMessage);

	return this;
};

/**
 * @param {mixed} newData
 * @return {object}
 */
const setData = function (newData = null) {
	this._content.data = newData;

	return this;
};

/**
 * @return {object}
 */
const output = function () {
	return this._content;
};

/**
 * @param {object} mergedData
 * @return {object}
 */
const httpResponseResultTemplate = (mergedData = {}) => ({
	_content: {
		message: 'http request completed successfully',
		data: null,
		...mergedData,
	},
	output,
	setMessage,
	setData,
});

module.exports = httpResponseResultTemplate;
