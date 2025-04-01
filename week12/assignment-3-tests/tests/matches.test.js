const {
  goodResponse,
  notFoundResponse,
  badRequestResponse,
  convertJSON,
  requestFactory,
  unauthorizedResponse,
  forbiddenResponse,
} = require('./helpers');
const {
  createMatch,
  getMatches,
  getMatchesRaw,
  createCourt,
  createUser,
  connect,
  dropDbs,
} = require('./db');
const { mockMatches, MOCK_MATCH_ID } = require('./mocks/match');
const { mockCourts, MOCK_COURT_ID } = require('./mocks/court');
const {
  mockUsers,
  TOKEN_1,
  TOKEN_2,
  MOCK_P1_ID,
  MOCK_P2_ID,
} = require('./mocks/user');

const MATCH_ID = MOCK_MATCH_ID.toString();
const COURT_ID = MOCK_COURT_ID.toString();
const P1_ID = MOCK_P1_ID.toString();
const P2_ID = MOCK_P2_ID.toString();
const BAD_ID = '123412341234123412341234';

const EXPECTED_MATCH = convertJSON({
  ...mockMatches[0],
  court: mockCourts[0],
  player1: { _id: mockUsers[0]._id, name: mockUsers[0].name },
  player2: { _id: mockUsers[1]._id, name: mockUsers[1].name },
  winner: { _id: mockUsers[1]._id, name: mockUsers[1].name },
});
const request = requestFactory('/api/matches');

describe('MATCH RESOURCE', () => {
  let disconnect;
  beforeEach(async () => {
    disconnect = await connect();
  });
  afterEach(async () => {
    await dropDbs();
    await disconnect();
  });
  describe('getAll', () => {
    beforeEach(async () => {
      await Promise.all([
        ...mockUsers.map(createUser),
        createCourt(mockCourts[0]),
        ...mockMatches.map(createMatch),
      ]);
    });
    it('happy path', async () => {
      const { data, status } = await request('get', '/', TOKEN_1);

      goodResponse(data, status);
      expect(Array.isArray(data.data)).toBe(true);

      const dbMatches = await getMatches();
      expect(data.data).toEqual(dbMatches);
    });
    it('should have status 401', async () => {
      const { data, status } = await request('get', '/');

      unauthorizedResponse(data, status);
    });
  });

  describe('getOne', () => {
    beforeEach(async () => {
      await Promise.all([
        ...mockUsers.map(createUser),
        createCourt(mockCourts[0]),
        createMatch(mockMatches[0]),
      ]);
    });
    it('happy path', async () => {
      const { data, status } = await request('get', `/${MATCH_ID}`, TOKEN_1);
      const [dbMatch] = await getMatches();

      goodResponse(data, status);
      expect(data.data).toEqual(dbMatch);
    });
    it('should throw 400 for bad id', async () => {
      const { data, status } = await request('get', '/badid', TOKEN_1);
      badRequestResponse(data, status);
    });
    it('should throw 401', async () => {
      const { data, status } = await request('get', `/${MATCH_ID}`);

      unauthorizedResponse(data, status);
    });
    it('should throw 404', async () => {
      const { data, status } = await request('get', `/${BAD_ID}`, TOKEN_1);

      notFoundResponse(data, status);
    });
  });

  describe('create', () => {
    const newMatch = {
      court: COURT_ID,
      player2: P2_ID,
      sets: [...mockMatches[0].sets],
      winner: P2_ID,
    };
    beforeEach(async () => {
      await Promise.all([
        ...mockUsers.map(createUser),
        createCourt(mockCourts[0]),
      ]);
    });

    it('happy path', async () => {
      const { data, status } = await request('post', '/', TOKEN_1, newMatch);
      expect(status).toBe(201);
      expect(data).toHaveProperty('data');

      const [dbMatch] = await getMatchesRaw();
      expect(data.data).toEqual(dbMatch);

      delete data.data._id;
      expect(data.data).toEqual({ ...newMatch, player1: P1_ID });
    });
    it('should throw 400', async () => {
      const { data, status } = await request('post', '/', TOKEN_1, {});

      badRequestResponse(data, status);
    });
    it('should throw 400 for invalid array sets', async () => {
      const { data, status } = await request('post', '/', TOKEN_1, {
        sets: [],
      });

      badRequestResponse(data, status);
    });
    it('should protect against xss (remove script)', async () => {
      const input = {
        ...newMatch,
        sets: [['<script>muaha</script>']],
      };

      const { data, status } = await request('post', '/', TOKEN_1, input);
      badRequestResponse(data, status);
    });
    it('should protect against xss (remove tags)', async () => {
      const input = {
        ...newMatch,
        sets: [
          [0, '<h1>6</h1>'],
          [0, 6],
        ],
      };

      const { data, status } = await request('post', '/', TOKEN_1, input);
      expect(status).toBe(201);
      expect(data).toHaveProperty('data');

      const [dbMatch] = await getMatchesRaw();
      expect(data.data).toEqual(dbMatch);

      delete data.data._id;
      expect(data.data).toEqual({
        ...newMatch,
        player1: P1_ID,
        sets: [
          [0, 6],
          [0, 6],
        ],
      });
    });
    it('should throw 401', async () => {
      const { data, status } = await request('post', '/', 'invalid_token', {
        username: 'Test',
        sets: [],
      });

      unauthorizedResponse(data, status);
    });
  });

  describe('replace', () => {
    const updatedMatch = {
      court: COURT_ID,
      player1: P1_ID,
      player2: P2_ID,
      sets: [
        [6, 0],
        [6, 0],
      ],
      winner: P1_ID,
    };
    beforeEach(async () => {
      await Promise.all([
        ...mockUsers.map(createUser),
        createCourt(mockCourts[0]),
        createMatch(mockMatches[0]),
      ]);
    });
    it('happy path', async () => {
      const { data, status } = await request(
        'put',
        `/${MATCH_ID}`,
        TOKEN_1,
        updatedMatch
      );
      goodResponse(data, status);

      const [dbMatch] = await getMatches();
      expect(data.data).toEqual(dbMatch);
      expect(data.data).toEqual({
        _id: MATCH_ID,
        court: EXPECTED_MATCH.court,
        player1: EXPECTED_MATCH.player1,
        player2: EXPECTED_MATCH.player2,
        sets: updatedMatch.sets,
        winner: EXPECTED_MATCH.player1,
      });
    });
    it('should throw 400', async () => {
      const { data, status } = await request(
        'put',
        `/${MATCH_ID}`,
        TOKEN_1,
        {}
      );

      badRequestResponse(data, status);
    });
    it('should throw 400 for bad id', async () => {
      const { data, status } = await request('put', '/badid', TOKEN_1, {
        username: 'Update',
        sets: [...mockMatches[0].sets],
        court: COURT_ID,
      });
      badRequestResponse(data, status);
    });
    it('should throw 401 for bad token', async () => {
      const { data, status } = await request(
        'put',
        `/${MATCH_ID}`,
        'invalid_token',
        {
          username: 'Update',
          sets: [...mockMatches[0].sets],
          court: COURT_ID,
        }
      );
      unauthorizedResponse(data, status);
    });
    it('should throw 403 for wrong user', async () => {
      const { data, status } = await request(
        'put',
        `/${MATCH_ID}`,
        TOKEN_2,
        updatedMatch
      );
      forbiddenResponse(data, status);
    });
    it('should throw 404', async () => {
      const { data, status } = await request(
        'put',
        `/${BAD_ID}`,
        TOKEN_1,
        updatedMatch
      );

      notFoundResponse(data, status);
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await Promise.all([
        ...mockUsers.map(createUser),
        createCourt(mockCourts[0]),
        createMatch(mockMatches[0]),
      ]);
    });
    it('happy path sets', async () => {
      const updatedMatch = {
        sets: [...mockMatches[0].sets],
      };

      const { data, status } = await request(
        'patch',
        `/${MATCH_ID}`,
        TOKEN_1,
        updatedMatch
      );

      goodResponse(data, status);

      const [dbMatch] = await getMatches();
      expect(dbMatch).toEqual(data.data);
      expect(dbMatch).toEqual({ ...EXPECTED_MATCH, ...updatedMatch });
    });
    it('should not allow random keys', async () => {
      const updatedMatch = {
        script: 'malware',
      };

      const { data, status } = await request(
        'patch',
        `/${MATCH_ID}`,
        TOKEN_1,
        updatedMatch
      );

      goodResponse(data, status);

      expect(data.data).toEqual(EXPECTED_MATCH);
    });
    it('should throw 400 for bad id', async () => {
      const { data, status } = await request('patch', '/badid', TOKEN_1, {
        username: 'test',
      });
      badRequestResponse(data, status);
    });
    it('should throw 404', async () => {
      const { data, status } = await request('patch', `/${BAD_ID}`, TOKEN_1, {
        username: 'test',
      });

      notFoundResponse(data, status);
    });
  });

  describe('delete', () => {
    beforeEach(async () => {
      await Promise.all([
        ...mockUsers.map(createUser),
        createCourt(mockCourts[0]),
        createMatch(mockMatches[0]),
      ]);
    });

    it('happy path', async () => {
      const { data, status } = await request('delete', `/${MATCH_ID}`, TOKEN_1);

      goodResponse(data, status);

      expect(data.data).toEqual(EXPECTED_MATCH);
      const dbMatches = await getMatches();
      expect(dbMatches.length).toBe(0);
    });
    it('should throw 400 for bad id', async () => {
      const { data, status } = await request('delete', '/badid', TOKEN_1);
      badRequestResponse(data, status);
    });
    it('should throw 401 for bad token', async () => {
      const { data, status } = await request(
        'delete',
        `/${MATCH_ID}`,
        'bad-token'
      );
      unauthorizedResponse(data, status);
    });
    it('should throw 403 for not your match', async () => {
      const { data, status } = await request('delete', `/${MATCH_ID}`, TOKEN_2);
      forbiddenResponse(data, status);
    });
    it('should throw 404', async () => {
      const { data, status } = await request('delete', `/${BAD_ID}`, TOKEN_1);
      notFoundResponse(data, status);
    });
  });
});
