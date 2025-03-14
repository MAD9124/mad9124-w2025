const { mockCourts } = require("../mocks/court");
const { mockMatches } = require("../mocks/match");
const { createCourt, createMatch, disconnect } = require(".");

const main = async () => {
  await Promise.all([
    ...mockCourts.map(createCourt),
    ...mockMatches.map(createMatch),
  ]);
  await disconnect();
};

main();
