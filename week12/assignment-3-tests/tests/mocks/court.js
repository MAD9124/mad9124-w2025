const { ObjectId } = require("mongodb");

const MOCK_COURT_ID = new ObjectId();

const mockCourts = [
  {
    _id: MOCK_COURT_ID,
    name: "Glen Cairn Tennis Club",
    count: 4,
  },
  {
    name: "West Ottawa Tennis Club",
    count: 6,
  },
];

module.exports = {
  MOCK_COURT_ID,
  mockCourts,
};
