const fs = require('fs');
const path = require('path');
const {
  goodResponse,
  notFoundResponse,
  badRequestResponse,
  requestFactory,
  unauthorizedResponse,
  forbiddenResponse,
  convertJSON,
} = require('./helpers');
const {
  disconnect,
  createUser,
  dropDbs,
  getCrap,
  getCrapRaw,
  createCrap,
} = require('./db');
const {
  mockUsers,
  MOCK_SELLER_ID,
  generateToken,
  MOCK_BUYER_ID,
} = require('./mocks/user');
const { mockCrap, AVAILABLE_CRAP_ID } = require('./mocks/crap');

const imageBuffer = fs.readFileSync(path.join(__dirname, './test.png'));

const BAD_ID = '123412341234123412341234';

const request = requestFactory('/api/crap');

afterEach(async () => {
  await dropDbs();
});

afterAll(() => {
  disconnect();
});

describe('BASIC CRUD', () => {
  const form = new FormData();
  form.append(
    'images',
    new Blob([imageBuffer], { type: 'image/png' }),
    'test.png'
  );
  form.append('title', 'Test');
  form.append('description', 'Test');
  form.append('lat', '45');
  form.append('long', '-75');
  // I prefer the first way, but this is an option
  // form.append('location', '{"type":"Point","coordinates":[-75,45]}');

  describe('create', () => {
    beforeEach(async () => {
      await createUser(mockUsers[0]);
    });
    it('happy path', async () => {
      const EXPECTED = convertJSON({
        title: 'Test',
        description: 'Test',
        location: {
          type: 'Point',
          coordinates: [-75, 45],
        },
        owner: MOCK_SELLER_ID,
        status: 'AVAILABLE',
      });

      const { data, status } = await request(
        'post',
        '/',
        generateToken(MOCK_SELLER_ID),
        form
      );

      expect(status).toBe(201);
      expect(data).toHaveProperty('data');

      const [dbCrap] = await getCrapRaw();
      expect(dbCrap?.images[0]).toMatch(
        /^https:\/\/storage\.googleapis\.com\/.+\/\d+-test\.png/
      );
      expect(dbCrap).toEqual(data.data);

      expect(data.data).toMatchObject(EXPECTED);
    });
    it('should throw 400 | empty', async () => {
      const emptyForm = new FormData();
      const { data, status } = await request(
        'post',
        '/',
        generateToken(MOCK_SELLER_ID),
        emptyForm
      );

      badRequestResponse(data, status);
    });
    it('should throw 400 2', async () => {
      form.set('title', 't');
      const { data, status } = await request(
        'post',
        '/',
        generateToken(MOCK_SELLER_ID),
        form
      );

      badRequestResponse(data, status);
    });
    it('should throw 400 3', async () => {
      form.set(
        'description',
        'aasdfasdfasdifoawhjfoiahjdofiasdhjofiasdfoiasdfjolasidfjasdfasdfasdfasdifoawhjfoiahjdofiasdhjofiasdfoiasdfjolasidfjasdfasdfasdfasdifoawhjfoiahjdofiasdhjofiasdfoiasdfjolasidfjasdfasdfasdfasdifoawhjfoiahjdofiasdhjofiasdfoiasdfjolasidfjasdfsdfasdfasdifoawhjfoiahjdofiasdhjofiasdfoiasdfjolasidfjasdf'
      );
      const { data, status } = await request(
        'post',
        '/',
        generateToken(MOCK_SELLER_ID),
        form
      );

      badRequestResponse(data, status);
    });
    it('should throw 401', async () => {
      const { data, status } = await request('post', '/', null, form);

      unauthorizedResponse(data, status);
    });
  });

  describe('replace', () => {
    const form = new FormData();
    form.append(
      'images',
      new Blob([imageBuffer], { type: 'image/png' }),
      'test.png'
    );
    form.append('title', 'Update');
    form.append('description', 'Update');
    form.append('lat', '45');
    form.append('long', '-75');

    const EXPECTED = convertJSON({
      _id: AVAILABLE_CRAP_ID,
      title: 'Update',
      description: 'Update',
      location: {
        type: 'Point',
        coordinates: [-75, 45],
      },
      status: 'AVAILABLE',
      owner: {
        _id: MOCK_SELLER_ID,
        name: 'Tim',
      },
    });

    beforeEach(async () => {
      await Promise.all([
        createUser(mockUsers[0]),
        createUser(mockUsers[1]),
        createCrap(mockCrap[0]),
      ]);
    });
    it('happy path', async () => {
      const { data, status } = await request(
        'put',
        `/${AVAILABLE_CRAP_ID}`,
        generateToken(MOCK_SELLER_ID),
        form
      );
      goodResponse(data, status);

      const [dbCrap] = await getCrap();
      expect(dbCrap).toEqual(data.data);

      expect(data.data.images[0]).toMatch(
        /^https:\/\/storage.googleapis.com\/.+\/\d+-test\.png$/
      );
      expect(
        data.data.images[0]?.includes(process.env.GOOGLE_STORAGE_BUCKET_NAME)
      ).toBe(true);
      expect(data.data).toMatchObject(EXPECTED);
    });
    it('should throw 400', async () => {
      const { data, status } = await request(
        'put',
        `/${AVAILABLE_CRAP_ID}`,
        generateToken(MOCK_SELLER_ID),
        new FormData()
      );

      badRequestResponse(data, status);
    });
    it('should throw 400 2', async () => {
      const { data, status } = await request(
        'put',
        `/${AVAILABLE_CRAP_ID}`,
        generateToken(MOCK_SELLER_ID),
        {
          name: 'U',
          type: 'update',
          tricks: ['A Trick', 'B Trick'],
        }
      );

      badRequestResponse(data, status);
    });
    it('should throw 404', async () => {
      const { data, status } = await request(
        'put',
        `/${BAD_ID}`,
        generateToken(MOCK_SELLER_ID),
        form
      );

      notFoundResponse(data, status);
    });
    it('should throw 400', async () => {
      const { data, status } = await request(
        'put',
        `/123`,
        generateToken(MOCK_SELLER_ID)
      );

      badRequestResponse(data, status);
    });
    it('should throw 401', async () => {
      const { data, status } = await request(
        'put',
        `/${AVAILABLE_CRAP_ID}`,
        null,
        form
      );

      unauthorizedResponse(data, status);
    });
    it('should throw 403', async () => {
      const { data, status } = await request(
        'put',
        `/${AVAILABLE_CRAP_ID}`,
        generateToken(MOCK_BUYER_ID),
        form
      );

      forbiddenResponse(data, status);
    });
  });

  describe('update', () => {
    const EXPECTED = convertJSON({
      ...mockCrap[0],
      owner: { _id: MOCK_SELLER_ID, name: 'Tim' },
    });
    beforeEach(async () => {
      await Promise.all([
        createUser(mockUsers[0]),
        createUser(mockUsers[1]),
        createCrap(mockCrap[0]),
      ]);
    });
    it('happy path title', async () => {
      const { data, status } = await request(
        'patch',
        `/${AVAILABLE_CRAP_ID}`,
        generateToken(MOCK_SELLER_ID),
        { title: '12345' }
      );

      goodResponse(data, status);

      const [dbCrap] = await getCrap();
      expect(dbCrap).toEqual(data.data);

      expect({ ...EXPECTED, title: '12345' }).toMatchObject(dbCrap);
    });
    it('happy path description', async () => {
      const { data, status } = await request(
        'patch',
        `/${AVAILABLE_CRAP_ID}`,
        generateToken(MOCK_SELLER_ID),
        { description: '12345' }
      );

      goodResponse(data, status);

      const [dbCrap] = await getCrap();
      expect(dbCrap).toEqual(data.data);
      expect(dbCrap).toEqual({ ...EXPECTED, description: '12345' });
    });
    it('should throw 404', async () => {
      const { data, status } = await request(
        'patch',
        `/${BAD_ID}`,
        generateToken(MOCK_SELLER_ID),
        form
      );

      notFoundResponse(data, status);
    });
    it('should throw 400', async () => {
      const { data, status } = await request(
        'patch',
        `/123`,
        generateToken(MOCK_SELLER_ID),
        form
      );

      badRequestResponse(data, status);
    });
    it('should throw 401', async () => {
      const { data, status } = await request(
        'patch',
        `/${AVAILABLE_CRAP_ID}`,
        null,
        form
      );

      unauthorizedResponse(data, status);
    });
    it('should throw 403', async () => {
      const { data, status } = await request(
        'patch',
        `/${AVAILABLE_CRAP_ID}`,
        generateToken(MOCK_BUYER_ID),
        form
      );

      forbiddenResponse(data, status);
    });
  });

  describe('delete', () => {
    const EXPECTED = convertJSON({
      ...mockCrap[0],
      owner: {
        _id: MOCK_SELLER_ID,
        name: 'Tim',
      },
    });
    beforeEach(async () => {
      await Promise.all([
        createUser(mockUsers[0]),
        createUser(mockUsers[1]),
        createCrap(mockCrap[0]),
      ]);
    });

    it('happy path', async () => {
      const { data, status } = await request(
        'delete',
        `/${AVAILABLE_CRAP_ID}`,
        generateToken(MOCK_SELLER_ID)
      );

      goodResponse(data, status);

      expect(EXPECTED).toEqual(data.data);
    });
    it('should throw 404', async () => {
      const { data, status } = await request(
        'delete',
        `/${BAD_ID}`,
        generateToken(MOCK_SELLER_ID)
      );
      notFoundResponse(data, status);
    });
    it('should throw 400', async () => {
      const { data, status } = await request(
        'delete',
        `/123`,
        generateToken(MOCK_SELLER_ID)
      );

      badRequestResponse(data, status);
    });
    it('should throw 401', async () => {
      const { data, status } = await request(
        'delete',
        `/${AVAILABLE_CRAP_ID}`,
        null,
        {
          name: 'Update',
        }
      );

      unauthorizedResponse(data, status);
    });
    it('should throw 403', async () => {
      const { data, status } = await request(
        'delete',
        `/${AVAILABLE_CRAP_ID}`,
        generateToken(MOCK_BUYER_ID),
        {
          name: 'Update',
        }
      );

      forbiddenResponse(data, status);
    });
  });
});
