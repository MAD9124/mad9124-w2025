const {
  goodResponse,
  requestFactory,
  unauthorizedResponse,
} = require('./helpers');
const {
  disconnect,
  createUser,
  dropDbs,
  getCrap,
  createCrap,
} = require('./db');
const {
  mockUsers,
  MOCK_SELLER_ID,
  generateToken,
  MOCK_BUYER_ID,
  MOCK_OTHER_ID,
} = require('./mocks/user');
const { mockCrap, SCHEDULED_CRAP_ID, AGREED_CRAP_ID } = require('./mocks/crap');

const BAD_ID = '123412341234123412341234';

const request = requestFactory('/api/crap');

afterEach(async () => {
  await dropDbs();
});

afterAll(() => {
  disconnect();
});

describe('gets', () => {
  describe('search', () => {
    beforeEach(async () => {
      await Promise.all([
        createUser(mockUsers[0]),
        ...mockCrap.map(createCrap),
      ]);
    });
    it('should return only available', async () => {
      const { data, status } = await request(
        'get',
        '?lat=45.123&long=-75.123&distance=10000&query=',
        generateToken(MOCK_SELLER_ID)
      );
      goodResponse(data, status);

      expect(data.data);
      expect(Array.isArray(data.data)).toBe(true);

      const dbCrap = await getCrap(
        { status: 'AVAILABLE' },
        { location: 0, buyer: 0 }
      );
      expect(data.data).toEqual(dbCrap);
    });
    it('should return all but flushed', async () => {
      const { data, status } = await request(
        'get',
        '?lat=45.123&long=-75.123&distance=10000&query=&show_taken=true',
        generateToken(MOCK_SELLER_ID)
      );
      goodResponse(data, status);

      expect(data.data);
      expect(Array.isArray(data.data)).toBe(true);

      const dbCrap = await getCrap(
        {
          status: { $ne: 'FLUSHED' },
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [-75.123, 45.123],
              },
              $maxDistance: 10000,
            },
          },
        },
        { location: 0, buyer: 0, suggestion: 0 }
      );
      expect(data.data).toEqual(dbCrap);
    });
    it('should return correct based on text', async () => {
      const { data, status } = await request(
        'get',
        '?query=test&lat=45.123&long=-75.123&distance=10000&show_taken=true',
        generateToken(MOCK_SELLER_ID)
      );
      goodResponse(data, status);

      expect(data.data);
      expect(Array.isArray(data.data)).toBe(true);

      const dbCrap = await getCrap(
        {
          status: { $in: ['AVAILABLE', 'INTERESTED'] },
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [-75.123, 45.123],
              },
              $maxDistance: 10000,
            },
          },
        },
        { location: 0, buyer: 0, suggestion: 0 }
      );
      expect(data.data).toEqual(dbCrap);
    });
    it('should return nothing', async () => {
      const { data, status } = await request(
        'get',
        '?lat=46.123&long=-76.123&distance=1000&query=',
        generateToken(MOCK_SELLER_ID)
      );
      goodResponse(data, status);

      expect(data.data);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data).toEqual([]);
    });
    it('should return 401 if unauthenticated', async () => {
      const { data, status } = await request(
        'get',
        '?lat=46.123&long=-76.123&distance=10000'
      );
      unauthorizedResponse(data, status);
    });
  });

  describe('GET ONE', () => {
    beforeEach(async () => {
      await Promise.all([
        ...mockUsers.map(createUser),
        ...mockCrap.map(createCrap),
      ]);
    });
    it('should return limited data', async () => {
      const { data, status } = await request(
        'get',
        `/${AGREED_CRAP_ID}`,
        generateToken(MOCK_OTHER_ID)
      );
      goodResponse(data, status);

      expect(data.data);
      const [dbCrap] = await getCrap(
        { _id: AGREED_CRAP_ID },
        { buyer: 0, location: 0, suggestion: 0 }
      );
      expect(data.data).toEqual(dbCrap);
    });
    it('return rich data to seller', async () => {
      const { data, status } = await request(
        'get',
        `/${SCHEDULED_CRAP_ID}`,
        generateToken(MOCK_SELLER_ID)
      );
      goodResponse(data, status);

      expect(data.data);
      const [dbCrap] = await getCrap({ _id: SCHEDULED_CRAP_ID });
      expect(data.data).toEqual(dbCrap);
    });
    it('return rich data to buyer', async () => {
      const { data, status } = await request(
        'get',
        `/${SCHEDULED_CRAP_ID}`,
        generateToken(MOCK_BUYER_ID)
      );
      goodResponse(data, status);

      expect(data.data);
      const [dbCrap] = await getCrap({ _id: SCHEDULED_CRAP_ID });
      expect(data.data).toEqual(dbCrap);
    });
    it('should return 401 if unauthenticated', async () => {
      const { data, status } = await request('get', `/${BAD_ID}`);
      unauthorizedResponse(data, status);
    });
  });
  describe('GET MINE', () => {
    beforeEach(async () => {
      await Promise.all([
        ...mockUsers.map(createUser),
        ...mockCrap.map(createCrap),
      ]);
    });
    it('happy path', async () => {
      const { data, status } = await request(
        'get',
        '/mine',
        generateToken(MOCK_BUYER_ID)
      );
      goodResponse(data, status);

      expect(data).toHaveProperty('data');
      const dbCrap = await getCrap({
        $or: [{ buyer: MOCK_BUYER_ID }, { owner: MOCK_BUYER_ID }],
      });
      expect(data.data).toEqual(dbCrap);
    });
  });
});
