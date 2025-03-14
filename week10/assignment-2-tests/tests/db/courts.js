const { convertJSON } = require("../helpers");

const { Court } = global;

const createCourt = async (court) => {
  const { insertedId } = await Court.insertOne(court);
  return insertedId;
};

const getCourts = async () => {
  const courts = await Court.find(
    {},
    { projection: { updatedAt: 0, createdAt: 0, __v: 0 } },
  ).toArray();

  return courts.map(convertJSON);
};

module.exports = {
  createCourt,
  getCourts,
};
