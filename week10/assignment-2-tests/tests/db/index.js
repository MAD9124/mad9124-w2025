require("dotenv/config");
const mongodb = require("mongodb");

console.log(process.env.MONGO_URL);
const client = new mongodb.MongoClient(process.env.MONGO_URL);
const db = client.db(process.env.TEST_DB);

global.Court = db.collection("courts");
global.Match = db.collection("matches");

const courtFns = require("./courts");
const matchFns = require("./matches");

const dropDbs = async () => {
  await Court.deleteMany({});
  await Match.deleteMany({});
};

const disconnect = async () => {
  client.close();
};

module.exports = {
  disconnect,
  dropDbs,
  ...courtFns,
  ...matchFns,
};
