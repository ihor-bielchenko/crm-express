const statisticService = require('../../services/statistic');

/**
 * @return {void}
 */
(async function () {
  await statisticService.loadAll({startDate: '08/10/2022', endDate: '08/17/2022'});
})();
