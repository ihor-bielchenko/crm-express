const Enum = require('enum')

const statuses = new Enum({
    gold: 1,
    silver: 2,
    bronze: 3,
});

module.exports = statuses;
