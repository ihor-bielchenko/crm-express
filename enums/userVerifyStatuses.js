const Enum = require('enum')

const statuses = new Enum({
    newRequest: 1,
    approved: 2,
    canceled: 3,
});

module.exports = statuses;
