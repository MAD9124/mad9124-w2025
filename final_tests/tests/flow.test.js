const {
  goodResponse,
  requestFactory,
  unauthorizedResponse,
  badRequestResponse,
  forbiddenResponse,
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
const {
  mockCrap,
  SCHEDULED_CRAP_ID,
  AGREED_CRAP_ID,
  INTERESTED_CRAP_ID,
  AVAILABLE_CRAP_ID,
  FLUSHED_CRAP_ID,
} = require('./mocks/crap');

const request = requestFactory('/api/crap');

afterEach(async () => {
  await dropDbs();
});

afterAll(() => {
  disconnect();
});

describe('flows', () => {
  describe('flow1', () => {
    describe('Interested', () => {
      beforeEach(async () => {
        await Promise.all([
          ...mockUsers.map(createUser),
          ...mockCrap.map(createCrap),
        ]);
      });
      it('should return 401 if unauthenticated', async () => {
        const { data, status } = await request(
          'post',
          `/${AVAILABLE_CRAP_ID}/interested`
        );
        unauthorizedResponse(data, status);
      });
      it('should throw 400 if not AVAILABLE', async () => {
        const { data, status } = await request(
          'post',
          `/${INTERESTED_CRAP_ID}/interested`,
          generateToken(MOCK_SELLER_ID)
        );
        badRequestResponse(data, status);
      });
      it('should update the buyer and status', async () => {
        const { data, status } = await request(
          'post',
          `/${AVAILABLE_CRAP_ID}/interested`,
          generateToken(MOCK_BUYER_ID)
        );
        goodResponse(data, status);

        const [dbCrap] = await getCrap({ _id: AVAILABLE_CRAP_ID });
        expect(data.data).toEqual(dbCrap);
        expect(dbCrap.buyer._id.toString()).toEqual(MOCK_BUYER_ID.toString());
        expect(dbCrap.status).toEqual('INTERESTED');
      });
    });

    describe('Suggested', () => {
      beforeEach(async () => {
        await Promise.all([
          ...mockUsers.map(createUser),
          ...mockCrap.map(createCrap),
        ]);
      });
      it('should return 401 if unauthenticated', async () => {
        const { data, status } = await request(
          'post',
          `/${INTERESTED_CRAP_ID}/suggest`,
          null,
          { date: '2024-05-01', address: '123 Test st', time: '12:00-1:00' }
        );
        unauthorizedResponse(data, status);
      });
      it('should throw 400 if not INTERESTED', async () => {
        const { data, status } = await request(
          'post',
          `/${AVAILABLE_CRAP_ID}/suggest`,
          generateToken(MOCK_SELLER_ID),
          { date: '2024-05-01', address: '123 Test st', time: '12:00-1:00' }
        );
        badRequestResponse(data, status);
      });
      it('should throw 403 if not the seller', async () => {
        const { data, status } = await request(
          'post',
          `/${INTERESTED_CRAP_ID}/suggest`,
          generateToken(MOCK_BUYER_ID),
          { date: '2024-05-01', address: '123 Test st', time: '12:00-1:00' }
        );
        forbiddenResponse(data, status);
      });
      it('should update the suggestion', async () => {
        const { data, status } = await request(
          'post',
          `/${INTERESTED_CRAP_ID}/suggest`,
          generateToken(MOCK_SELLER_ID),
          { date: '2024-05-01', address: '123 Test st', time: '12:00-1:00' }
        );
        goodResponse(data, status);

        const [dbCrap] = await getCrap({ _id: INTERESTED_CRAP_ID });
        expect(data.data).toEqual(dbCrap);
        expect(dbCrap.suggestion).toEqual({
          date: '2024-05-01T00:00:00.000Z',
          address: '123 Test st',
          time: '12:00-1:00',
        });
        expect(dbCrap.status).toEqual('SCHEDULED');
      });
    });
  });

  describe('flow2', () => {
    describe('Agreed', () => {
      beforeEach(async () => {
        await Promise.all([
          ...mockUsers.map(createUser),
          ...mockCrap.map(createCrap),
        ]);
      });
      it('should return 401 if unauthenticated', async () => {
        const { data, status } = await request(
          'post',
          `/${SCHEDULED_CRAP_ID}/agree`
        );
        unauthorizedResponse(data, status);
      });
      it('should throw 400 if not SCHEDULED', async () => {
        const { data, status } = await request(
          'post',
          `/${INTERESTED_CRAP_ID}/agree`,
          generateToken(MOCK_BUYER_ID)
        );
        badRequestResponse(data, status);
      });
      it('should throw 403 if not the buyer', async () => {
        const { data, status } = await request(
          'post',
          `/${SCHEDULED_CRAP_ID}/agree`,
          generateToken(MOCK_OTHER_ID)
        );
        forbiddenResponse(data, status);
      });
      it('should update the status', async () => {
        const { data, status } = await request(
          'post',
          `/${SCHEDULED_CRAP_ID}/agree`,
          generateToken(MOCK_BUYER_ID)
        );
        goodResponse(data, status);

        const [dbCrap] = await getCrap({ _id: SCHEDULED_CRAP_ID });
        expect(data.data).toEqual(dbCrap);
        expect(dbCrap.status).toEqual('AGREED');
      });
    });

    describe('Flushed', () => {
      beforeEach(async () => {
        await Promise.all([
          ...mockUsers.map(createUser),
          ...mockCrap.map(createCrap),
        ]);
      });
      it('should return 401 if unauthenticated', async () => {
        const { data, status } = await request(
          'post',
          `/${AGREED_CRAP_ID}/flush`
        );
        unauthorizedResponse(data, status);
      });
      'should throw 400 if not AGREED',
        async () => {
          const { data, status } = await request(
            'post',
            `/${INTERESTED_CRAP_ID}/flush`,
            generateToken(MOCK_BUYER_ID)
          );
          badRequestResponse(data, status);
        };
      it('should throw 403 if not the seller', async () => {
        const { data, status } = await request(
          'post',
          `/${AGREED_CRAP_ID}/flush`,
          generateToken(MOCK_BUYER_ID)
        );
        forbiddenResponse(data, status);
      });
      it('should update the status', async () => {
        const { data, status } = await request(
          'post',
          `/${AGREED_CRAP_ID}/flush`,
          generateToken(MOCK_SELLER_ID)
        );
        goodResponse(data, status);

        const [dbCrap] = await getCrap({ _id: AGREED_CRAP_ID });
        expect(data.data).toEqual(dbCrap);
        expect(dbCrap.status).toEqual('FLUSHED');
      });
    });
  });

  describe('flow3', () => {
    describe('Disagreed', () => {
      beforeEach(async () => {
        await Promise.all([
          ...mockUsers.map(createUser),
          ...mockCrap.map(createCrap),
        ]);
      });
      it('should return 401 if unauthenticated', async () => {
        const { data, status } = await request(
          'post',
          `/${SCHEDULED_CRAP_ID}/disagree`
        );
        unauthorizedResponse(data, status);
      });
      it('should throw 400 if not SCHEDULED', async () => {
        const { data, status } = await request(
          'post',
          `/${INTERESTED_CRAP_ID}/disagree`,
          generateToken(MOCK_BUYER_ID)
        );
        badRequestResponse(data, status);
      });
      it('should throw 403 if not the buyer', async () => {
        const { data, status } = await request(
          'post',
          `/${SCHEDULED_CRAP_ID}/disagree`,
          generateToken(MOCK_OTHER_ID)
        );
        forbiddenResponse(data, status);
      });
      it('should update the status and suggestion', async () => {
        const { data, status } = await request(
          'post',
          `/${SCHEDULED_CRAP_ID}/disagree`,
          generateToken(MOCK_BUYER_ID)
        );
        goodResponse(data, status);

        const [dbCrap] = await getCrap({ _id: SCHEDULED_CRAP_ID });
        expect(data.data).toEqual(dbCrap);
        expect(dbCrap.status).toEqual('INTERESTED');
        expect(dbCrap.suggestion).toEqual(null);
      });
    });

    describe('Reset', () => {
      beforeEach(async () => {
        await Promise.all([
          ...mockUsers.map(createUser),
          ...mockCrap.map(createCrap),
        ]);
      });
      it('should return 401 if unauthenticated', async () => {
        const { data, status } = await request(
          'post',
          `/${INTERESTED_CRAP_ID}/reset`
        );
        unauthorizedResponse(data, status);
      });
      it('should throw 403 if not buyer or seller', async () => {
        const { data, status } = await request(
          'post',
          `/${INTERESTED_CRAP_ID}/reset`,
          generateToken(MOCK_OTHER_ID)
        );
        forbiddenResponse(data, status);
      });
      it('should throw 400 if FLUSHED', async () => {
        const { data, status } = await request(
          'post',
          `/${FLUSHED_CRAP_ID}/reset`,
          generateToken(MOCK_SELLER_ID)
        );
        badRequestResponse(data, status);
      });
      it('should update the buyer, suggestion and status - SELLER', async () => {
        const { data, status } = await request(
          'post',
          `/${AGREED_CRAP_ID}/reset`,
          generateToken(MOCK_SELLER_ID)
        );
        goodResponse(data, status);

        const [dbCrap] = await getCrap({ _id: AGREED_CRAP_ID });
        expect(data.data).toEqual(dbCrap);
        expect(!dbCrap.buyer).toBe(true);
        expect(!dbCrap.suggestion).toBe(true);
        expect(dbCrap.status).toEqual('AVAILABLE');
      });
      it('should update the buyer, suggestion and status - BUYER', async () => {
        const { data, status } = await request(
          'post',
          `/${AGREED_CRAP_ID}/reset`,
          generateToken(MOCK_BUYER_ID)
        );
        goodResponse(data, status);

        const [dbCrap] = await getCrap({ _id: AGREED_CRAP_ID });
        expect(data.data).toEqual(dbCrap);
        expect(dbCrap.buyer).toEqual(null);
        expect(dbCrap.suggestion).toEqual(null);
        expect(dbCrap.status).toEqual('AVAILABLE');
      });
    });
  });
});
