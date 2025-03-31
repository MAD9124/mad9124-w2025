const { connect, dropDbs } = require(".");

const main = async () => {
  const disconnect = await connect();
  await dropDbs();
  await disconnect();
};

main();
