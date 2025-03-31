require("dotenv/config");
const mongodb = require("mongodb");
const { convertJSON } = require("../helpers");

const client = new mongodb.MongoClient(process.env.MONGO_URL);
const db = client.db(process.env.TEST_DB);

const Court = db.collection("courts");
const Match = db.collection("matches");
const User = db.collection("users");

const dropDbs = async () => {
  await Court.deleteMany({});
  await Match.deleteMany({});
  await User.deleteMany({});
};

const connect = async () => {
  const connection = await client.connect();
  return async () => {
    await connection.close();
  };
};

const createCourt = async (court) => {
  const { insertedId } = await Court.insertOne(court);
  return insertedId;
};

const projection = { updatedAt: 0, createdAt: 0, __v: 0 };

const getCourts = async () => {
  const courts = await Court.find({}, { projection }).toArray();

  return courts.map(convertJSON);
};

const createMatch = async (match) => {
  const { insertedId } = await Match.insertOne(match);
  return insertedId;
};

const getMatchesRaw = async () => {
  const matches = await Match.find({}, { projection }).toArray();

  return matches.map((p) =>
    convertJSON({
      ...p,
      _id: p._id.toString(),
    }),
  );
};

const getMatches = async () => {
  const matches = await Match.find({}, { projection }).toArray();

  const courtIds = new Set();
  const userIds = new Set();
  matches.forEach((m) => {
    courtIds.add(m.court);
    userIds.add(m.player1);
    userIds.add(m.player2);
  });

  const courts = await Court.find(
    { _id: { $in: [...courtIds] } },
    { projection },
  ).toArray();
  const users = await User.find(
    { _id: { $in: [...userIds] } },
    { projection: { ...projection, googleId: 0 } },
  ).toArray();

  const courtMap = courts.reduce((map, cv) => {
    map.set(cv._id.toString(), cv);
    return map;
  }, new Map());
  const userMap = users.reduce((map, cv) => {
    map.set(cv._id.toString(), cv);
    return map;
  }, new Map());

  return matches.map((p) =>
    convertJSON({
      ...p,
      _id: p._id.toString(),
      court: courtMap.get(p.court.toString()),
      player1: userMap.get(p.player1.toString()),
      player2: userMap.get(p.player2.toString()),
      winner: userMap.get(p.winner.toString()),
    }),
  );
};

const createUser = async (user) => {
  try {
    const { insertedId } = await User.insertOne(user);
    return insertedId;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  connect,
  dropDbs,
  createCourt,
  getCourts,
  createMatch,
  getMatches,
  getMatchesRaw,
  createUser,
};
