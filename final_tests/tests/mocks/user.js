const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const MOCK_SELLER_ID = new ObjectId('65f4b6e63d390f0884f0e107');
const MOCK_BUYER_ID = new ObjectId('65f4b6e63d390f0884f0e108');
const MOCK_OTHER_ID = new ObjectId('65f4b6e63d390f0884f0e109');

const generateToken = (_id) =>
  jwt.sign(JSON.stringify({ id: _id.toString(), _id }), process.env.JWT_SECRET);

const mockUsers = [
  {
    _id: MOCK_SELLER_ID,
    name: 'Tim',
    googleId: '1',
  },
  {
    _id: MOCK_BUYER_ID,
    name: 'Vincent',
    googleId: '2',
  },
  {
    _id: MOCK_OTHER_ID,
    name: 'Eduardo',
    googleId: '3',
  },
  {
    name: 'Luciano',
    googleId: '4',
  },
];

module.exports = {
  MOCK_BUYER_ID,
  MOCK_OTHER_ID,
  MOCK_SELLER_ID,
  mockUsers,
  generateToken,
};
