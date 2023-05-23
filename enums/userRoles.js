const Enum = require('enum')

const roles = new Enum({
    user: 1,
    admin: 2,
});

module.exports = roles;
