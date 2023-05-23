const fs = require("fs");

const upsell = async function (type, data) {
  let row = `TYPE: ${type}, DATE: ${(new Date()).toISOString()}, DATA: ${JSON.stringify(data)}`;
  await create('./upsell.log', row);
};

const create = async function (file, row) {
  let stream = fs.createWriteStream(file, {'flags': 'a'});
  stream.once('open', function(fd) {
    stream.write(row+"\r\n");
  });
};

module.exports = ({
  upsell,
  create,
});
