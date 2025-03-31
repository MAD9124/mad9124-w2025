const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const MOCK_P1_ID = new ObjectId("67e9fb84fc442f6a56bd466d");
const MOCK_P2_ID = new ObjectId("67e9fb84fc442f6a56bd466e");

const mockUsers = [
  {
    _id: MOCK_P1_ID,
    name: "Player 1",
    googleId: "116339519473059956243",
  },
  {
    _id: MOCK_P2_ID,
    name: "Player 2",
    googleId: "456",
  },
];

const TOKEN_1 = jwt.sign(mockUsers[0], process.env.JWT_SECRET, {
  expiresIn: "1 day",
});
const TOKEN_2 = jwt.sign(mockUsers[1], process.env.JWT_SECRET, {
  expiresIn: "1 day",
});

module.exports = {
  MOCK_P1_ID,
  MOCK_P2_ID,
  mockUsers,
  TOKEN_1,
  TOKEN_2,
};
