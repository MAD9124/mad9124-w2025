const {
  goodResponse,
  notFoundResponse,
  badRequestResponse,
  convertJSON,
  requestFactory,
} = require("./helpers");
const { getCourts, createCourt, connect, dropDbs } = require("./db");
const { mockCourts, MOCK_COURT_ID } = require("./mocks/court");
const { TOKEN_1 } = require("./mocks/user");

const COURT_ID = MOCK_COURT_ID.toString();
const BAD_ID = "123412341234123412341234";

const EXPECTED_COURT = convertJSON(mockCourts[0]);
const request = requestFactory("/api/courts");

describe("COURT RESOURCE", () => {
  let disconnect;
  beforeEach(async () => {
    disconnect = await connect();
  });
  afterEach(async () => {
    await dropDbs();
    await disconnect();
  });
  describe("getAll", () => {
    beforeEach(async () => {
      await Promise.all(mockCourts.map(createCourt));
    });
    it("happy path", async () => {
      const { data, status } = await request("get", "/");

      goodResponse(data, status);
      expect(Array.isArray(data.data)).toBe(true);

      const dbCourts = await getCourts();
      expect(data.data).toEqual(dbCourts);
    });
  });

  describe("getOne", () => {
    beforeEach(async () => {
      await createCourt(mockCourts[0]);
    });
    it("happy path", async () => {
      const { data, status } = await request("get", `/${COURT_ID}`);
      const [dbCourt] = await getCourts();

      goodResponse(data, status);
      expect(data.data).toEqual(dbCourt);
    });
    it("should throw 400 for bad id", async () => {
      const { data, status } = await request("get", "/badid");
      badRequestResponse(data, status);
    });
    it("should throw 404", async () => {
      const { data, status } = await request("get", `/${BAD_ID}`);
      notFoundResponse(data, status);
    });
  });

  describe("create", () => {
    it("happy path", async () => {
      const newCourt = {
        name: "Test Court",
        count: mockCourts[0].count,
      };

      const { data, status } = await request("post", "/", TOKEN_1, newCourt);
      expect(status).toBe(201);
      expect(data).toHaveProperty("data");

      const [dbCourt] = await getCourts();
      expect(data.data).toEqual(dbCourt);

      delete data.data._id;
      expect(data.data).toEqual(newCourt);
    });
    it("return 400 for bad input", async () => {
      const input = {
        name: "Test Court",
      };

      const { data, status } = await request("post", "/", TOKEN_1, input);
      badRequestResponse(data, status);
    });
    it("return 400 for bad input", async () => {
      const input = {
        count: 11,
      };

      const { data, status } = await request("post", "/", TOKEN_1, input);
      badRequestResponse(data, status);
    });
    it("should protect against xss (remove script)", async () => {
      const input = {
        name: "<script>Muahaha</script>",
        count: 11,
      };

      const { data, status } = await request("post", "/", TOKEN_1, input);
      badRequestResponse(data, status);
    });
    it("should protect against xss (remove tags)", async () => {
      const input = {
        name: "<a>Name</a>",
        count: 11,
      };

      const { data, status } = await request("post", "/", TOKEN_1, input);
      expect(status).toBe(201);
      expect(data).toHaveProperty("data");

      const [dbCourt] = await getCourts();
      expect(data.data).toEqual(dbCourt);

      delete data.data._id;
      expect(data.data).toEqual({ name: "Name", count: 11 });
    });
    it("return 400 for bad input", async () => {
      const input = {
        name: "Test",
        count: "abc",
      };

      const { data, status } = await request("post", "/", TOKEN_1, input);
      badRequestResponse(data, status);
    });
  });

  describe("replace", () => {
    beforeEach(async () => {
      await createCourt(mockCourts[0]);
    });
    it("happy path", async () => {
      const updatedCourt = {
        name: "Test Court",
        count: mockCourts[0].count,
      };

      const { data, status } = await request(
        "put",
        `/${COURT_ID}`,
        undefined,
        updatedCourt,
      );
      goodResponse(data, status);

      const [dbCourt] = await getCourts();
      expect(data.data).toEqual(dbCourt);
      expect(data.data).toEqual({ ...updatedCourt, _id: COURT_ID });
    });
    it("should throw 400 for bad id", async () => {
      const { data, status } = await request("put", "/badid", undefined, {});

      badRequestResponse(data, status);
    });
    it("should throw 400", async () => {
      const { data, status } = await request(
        "put",
        `/${COURT_ID}`,
        undefined,
        {},
      );

      badRequestResponse(data, status);
    });
    it("should throw 404", async () => {
      const { data, status } = await request("put", `/${BAD_ID}`, undefined, {
        name: "Test Court",
        count: mockCourts[0].count,
      });

      notFoundResponse(data, status);
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await createCourt(mockCourts[0]);
    });
    it("happy path name", async () => {
      const updatedCourt = {
        name: "Test Court",
      };

      const { data, status } = await request(
        "patch",
        `/${COURT_ID}`,
        undefined,
        updatedCourt,
      );

      goodResponse(data, status);

      const [dbCourt] = await getCourts();
      expect(dbCourt).toEqual(data.data);
      expect(dbCourt).toEqual({
        ...EXPECTED_COURT,
        ...updatedCourt,
      });
    });
    it("happy path count", async () => {
      const updatedCourt = {
        count: 11,
      };

      const { data, status } = await request(
        "patch",
        `/${COURT_ID}`,
        undefined,
        updatedCourt,
      );

      goodResponse(data, status);

      const [dbCourt] = await getCourts();
      expect(dbCourt).toEqual(data.data);
      expect(dbCourt).toEqual({
        ...EXPECTED_COURT,
        ...updatedCourt,
      });
    });
    it("should not allow random keys", async () => {
      const updatedCourt = {
        script: "malware",
      };

      const { data, status } = await request(
        "patch",
        `/${COURT_ID}`,
        undefined,
        updatedCourt,
      );

      goodResponse(data, status);

      expect(data.data).toEqual(EXPECTED_COURT);
    });
    it("should throw 400 for bad id", async () => {
      const { data, status } = await request("put", "/badid", undefined, {});

      badRequestResponse(data, status);
    });
    it("should throw 404", async () => {
      const { data, status } = await request("patch", `/${BAD_ID}`, undefined, {
        name: "test",
      });

      notFoundResponse(data, status);
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await createCourt(mockCourts[0]);
    });

    it("happy path", async () => {
      const { data, status } = await request("delete", `/${COURT_ID}`);

      goodResponse(data, status);

      expect(data.data).toEqual(EXPECTED_COURT);
      const dbCourts = await getCourts();
      expect(dbCourts.length).toBe(0);
    });
    it("should throw 400 for bad id", async () => {
      const { data, status } = await request("delete", "/badid");
      badRequestResponse(data, status);
    });
    it("should throw 404", async () => {
      const { data, status } = await request("delete", `/${BAD_ID}`);
      notFoundResponse(data, status);
    });
  });
});
