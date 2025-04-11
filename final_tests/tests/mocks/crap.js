const { ObjectId } = require('mongodb');
const { MOCK_SELLER_ID, MOCK_BUYER_ID } = require('./user');

const AVAILABLE_CRAP_ID = new ObjectId();
const INTERESTED_CRAP_ID = new ObjectId();
const SCHEDULED_CRAP_ID = new ObjectId();
const AGREED_CRAP_ID = new ObjectId();
const FLUSHED_CRAP_ID = new ObjectId();

const mockCrap = [
  {
    _id: AVAILABLE_CRAP_ID,
    title: 'Available test',
    description: 'Available',
    location: { type: 'Point', coordinates: [-75.123, 45.123] },
    owner: MOCK_SELLER_ID,
    status: 'AVAILABLE',
    images: ['https://googleapis.bucket/cars/test.png'],
  },
  {
    _id: INTERESTED_CRAP_ID,
    title: 'Interested',
    description: 'Interested TEST',
    location: { type: 'Point', coordinates: [-75.123, 45.123] },
    owner: MOCK_SELLER_ID,
    status: 'INTERESTED',
    images: ['https://googleapis.bucket/cars/test.png'],
    buyer: MOCK_BUYER_ID,
  },
  {
    _id: SCHEDULED_CRAP_ID,
    title: 'Scheduled',
    description: 'Schdeduled',
    location: { type: 'Point', coordinates: [-75.123, 45.123] },
    owner: MOCK_SELLER_ID,
    status: 'SCHEDULED',
    buyer: MOCK_BUYER_ID,
    images: ['https://googleapis.bucket/cars/test.png'],
    suggestion: {
      address: '123 fake st',
      date: new Date('2024-04-01'),
      time: '12',
    },
  },
  {
    _id: AGREED_CRAP_ID,
    title: 'Agreed',
    description: 'Agreed',
    location: { type: 'Point', coordinates: [-75.123, 45.123] },
    owner: MOCK_SELLER_ID,
    status: 'AGREED',
    images: ['https://googleapis.bucket/cars/test.png'],
    buyer: MOCK_BUYER_ID,
    suggestion: {
      address: '123 fake st',
      date: new Date('2024-04-01'),
      time: '12',
    },
  },
  {
    _id: FLUSHED_CRAP_ID,
    title: 'Flushed',
    description: 'Flushed',
    location: { type: 'Point', coordinates: [-75.123, 45.123] },
    owner: MOCK_SELLER_ID,
    status: 'FLUSHED',
    buyer: MOCK_BUYER_ID,
    images: [],
    suggestion: {
      address: '123 fake st',
      date: new Date('2024-04-01'),
      time: '12',
    },
  },
];

module.exports = {
  mockCrap,
  AVAILABLE_CRAP_ID,
  INTERESTED_CRAP_ID,
  SCHEDULED_CRAP_ID,
  AGREED_CRAP_ID,
  FLUSHED_CRAP_ID,
};
