const statisticService = require('../../services/statistic');
const statisticHelper = require('../../helpers/statistic');

/**
 * @return {void}
 */
const load = async function () {
  let date = new Date();
  date.setDate(date.getDate() - 90);
  const startDate = statisticHelper.makeKonekntiveDateFormat(date);
  date.setDate(date.getDate() + 90);
  const endDate = statisticHelper.makeKonekntiveDateFormat(date);
  await statisticService.loadAll({
    startDate,
    endDate
  });
};

module.exports = load;
