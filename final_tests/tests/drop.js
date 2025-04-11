const { disconnect, dropDbs } = require('./db');

const drop = async () => {
  await dropDbs();
  await disconnect();
};
