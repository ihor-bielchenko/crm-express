
/**
 * @param {string} day
 * @return {[object]}
 */
const getDate = function (day) {
  const date = new Date();

  if(day === 'today'){
    return date.toISOString().split('T')[0];
  }

  if(day === 'yesterday'){
    date.setDate(new Date().getDate() - 1);
    return date.toISOString().split('T')[0];
  }

  if(day === 'lastWeek'){
    date.setDate(new Date().getDate() - 7);
    return date.toISOString().split('T')[0];
  }

  if(day === 'beforeLastWeek'){
    date.setDate(new Date().getDate() - 14);
    return date.toISOString().split('T')[0];
  }
};

/**
 * @param {number} firstNumber
 * @param {number} secondNumber
 * @return {number}
 */
const getDifferencePercentsTwoNumbers = function (firstNumber, secondNumber) {
  if(firstNumber === 0 && secondNumber === 0){
    return 0;
  }
  if(firstNumber > secondNumber){
    return parseInt((firstNumber - secondNumber)/firstNumber*100);
  }
  return parseInt( (firstNumber - secondNumber)/secondNumber*100);
};

/**
 * @return {[]}
 */
const getLast30Days = function () {
  const date = new Date();
  const dates = [];
  dates.push(date.toISOString().split('T')[0]);

  for(let i = 0; i <= 30; i++){
    date.setDate(date.getDate() - 1);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

/**
 * @return {[]}
 */
const getLast12Weeks = function () {
  const date = new Date();
  const dates = [];

  date.setDate(date.getDate() - date.getDay());
  let endDate = date.toISOString().split('T')[0];

  date.setDate(date.getDate() - 6);
  let startDate = date.toISOString().split('T')[0];

  dates.push({
    startDate,
    endDate
  });

  for (let i = 0; i <= 11; i++) {
    date.setDate(date.getDate() - 1);
    startDate = date.toISOString().split('T')[0];

    date.setDate(date.getDate() - 6);
    endDate = date.toISOString().split('T')[0];

    dates.push({
      startDate,
      endDate
    });
  }
  return dates;

};

/**
 * @return {[]}
 */
const getLast12Months = function () {
  const date = new Date();
  const dates = [];
  const y = date.getFullYear();
  const m = date.getMonth();

  for(let i = 0; i <= 11; i++){
    const startDate = new Date(y, m - i, 2).toISOString().split('T')[0];
    const endDate = new Date(y, m - i + 1, 1).toISOString().split('T')[0];
    dates.push({
      startDate,
      endDate
    });
  }
  return dates;
};

/**
 * @param {Date} date
 * @return {string}
 */
const makeKonekntiveDateFormat = function (date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return  mm + '/' + dd + '/' + yyyy;
};

module.exports = {
  makeKonekntiveDateFormat,
  getLast30Days,
  getLast12Weeks,
  getLast12Months,
  getDate,
  getDifferencePercentsTwoNumbers,
};
