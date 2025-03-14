const { ObjectId } = require("mongodb");
const { MOCK_COURT_ID } = require("./court");

const MOCK_MATCH_ID = new ObjectId();

const mockMatches = [
  {
    _id: MOCK_MATCH_ID,
    court: MOCK_COURT_ID,
    player1: "steve",
    player2: "tim",
    sets: [
      [6, 4],
      [3, 6],
      [5, 7],
    ],
    winner: "tim",
  },
  {
    court: MOCK_COURT_ID,
    player1: "adam",
    player2: "tim",
    sets: [
      [0, 6],
      [0, 6],
    ],
    winner: "tim",
  },
  {
    court: MOCK_COURT_ID,
    player1: "annie",
    player2: "paulo",
    sets: [
      [6, 4],
      [3, 6],
      [6, 3],
    ],
    winner: "annie",
  },
];

module.exports = {
  mockMatches,
  MOCK_MATCH_ID,
};
