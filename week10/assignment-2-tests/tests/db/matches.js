const { convertJSON } = require("../helpers");
const { MOCK_COURT_ID } = require("../mocks/court");

const { Court, Match } = global;

const createMatch = async (match) => {
  const { insertedId } = await Match.insertOne(match);
  return insertedId;
};

const getMatchesRaw = async () => {
  const matches = await Match.find(
    {},
    { projection: { updatedAt: 0, createdAt: 0, __v: 0 } },
  ).toArray();

  return matches.map((p) =>
    convertJSON({
      ...p,
      _id: p._id.toString(),
    }),
  );
};

const getMatches = async () => {
  const matches = await Match.find(
    {},
    { projection: { updatedAt: 0, createdAt: 0, __v: 0 } },
  ).toArray();

  const court = await Court.findOne({ _id: MOCK_COURT_ID });

  return matches.map((p) =>
    convertJSON({
      ...p,
      _id: p._id.toString(),
      court,
    }),
  );
};

module.exports = {
  createMatch,
  getMatchesRaw,
  getMatches,
};
