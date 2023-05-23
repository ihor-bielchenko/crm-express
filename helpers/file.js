const { SERVER_URL } = require("../consts");

/**
 * @param {integer} id
 * @return {string}
 */
const makeAvatarPath = function (id) {
  return `storage/avatar/${id}`;
};

/**
 * @param {integer} id
 * @return {string}
 */
const makeAvatarFullPath = function (id) {
  return `${SERVER_URL}/${makeAvatarPath(id)}`;
};

const convertOriginToSmallAvatarPath = function (path) {
  return path.replace('origin', 'small');
};


module.exports = {
  makeAvatarFullPath,
  makeAvatarPath,
  convertOriginToSmallAvatarPath,
};
