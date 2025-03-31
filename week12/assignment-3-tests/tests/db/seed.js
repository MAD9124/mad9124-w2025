const { connect, createUser, createCourt, createMatch } = require(".");
const { mockCourts } = require("../mocks/court");
const { mockMatches } = require("../mocks/match");
const { mockUsers } = require("../mocks/user");

const main = async () => {
  const disconnect = await connect();
  await Promise.all([
    ...mockUsers.map(createUser),
    ...mockCourts.map(createCourt),
    ...mockMatches.map(createMatch),
  ]);
  await disconnect();
};

main();
