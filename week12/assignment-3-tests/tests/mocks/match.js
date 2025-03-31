const { ObjectId } = require("mongodb");
const { MOCK_COURT_ID } = require("./court");
const { MOCK_P1_ID, MOCK_P2_ID } = require("./user");

const MOCK_MATCH_ID = new ObjectId();

const mockMatches = [
  {
    _id: MOCK_MATCH_ID,
    court: MOCK_COURT_ID,
    player1: MOCK_P1_ID,
    player2: MOCK_P2_ID,
    sets: [
      [6, 4],
      [3, 6],
      [5, 7],
    ],
    winner: MOCK_P2_ID,
  },
  {
    court: MOCK_COURT_ID,
    player1: MOCK_P1_ID,
    player2: MOCK_P2_ID,
    sets: [
      [0, 6],
      [0, 6],
    ],
    winner: MOCK_P2_ID,
  },
  {
    court: MOCK_COURT_ID,
    player1: MOCK_P1_ID,
    player2: MOCK_P2_ID,
    sets: [
      [6, 4],
      [3, 6],
      [6, 3],
    ],
    winner: MOCK_P1_ID,
  },
];

module.exports = {
  mockMatches,
  MOCK_MATCH_ID,
};
