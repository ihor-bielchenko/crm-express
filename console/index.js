const schedule = require('node-schedule');
const loadStatisticCommand = require('./commands/loadStatisticCommand');

schedule.scheduleJob("53 * * * *", function() {
  loadStatisticCommand();
});
