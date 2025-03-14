const assert = require("assert");

const {
  goodResponse,
  notFoundResponse,
  badRequestResponse,
  convertJSON,
  requestFactory,
} = require("./helpers");
const { getCourts, createCourt } = require("./db");
const { mockCourts, MOCK_COURT_ID } = require("./mocks/court");

const COURT_ID = MOCK_COURT_ID.toString();
const BAD_ID = "123412341234123412341234";

const EXPECTED_COURT = convertJSON(mockCourts[0]);
const request = requestFactory("/api/courts");

describe("COURT RESOURCE", () => {
  describe("getAll", () => {
    beforeEach(async () => {
      await Promise.all(mockCourts.map(createCourt));
    });
    it("happy path", async () => {
      const { data, status } = await request("get", "/");

      goodResponse(data, status);
      assert(Array.isArray(data.data), "Expected data to be an array");

      const dbCourts = await getCourts();
      assert.deepStrictEqual(
        data.data,
        dbCourts,
        "Expected to get the courts from the db",
      );
    });
  });

  describe("getOne", async () => {
    beforeEach(async () => {
      await createCourt(mockCourts[0]);
    });
    it("happy path", async () => {
      const { data, status } = await request("get", `/${COURT_ID}`);
      const [dbCourt] = await getCourts();

      goodResponse(data, status);
      assert.deepStrictEqual(dbCourt, data.data, "Expected correct response");
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
        count: 3,
      };

      const { data, status } = await request("post", "/", newCourt);
      assert.strictEqual(status, 201, "Expected status 201");
      assert("data" in data, "Expected key of `data`");

      const [dbCourt] = await getCourts();
      assert.deepStrictEqual(data.data, dbCourt, "Expected update to be saved");

      delete data.data._id;
      assert.deepStrictEqual(
        data.data,
        newCourt,
        "Expect correct data to be returnd",
      );
    });
    it("return 400 for bad input - no name", async () => {
      const input = {
        count: 1,
      };

      const { data, status } = await request("post", "", input);
      badRequestResponse(data, status);
    });
    it("return 400 for bad input - name too short", async () => {
      const input = {
        name: "s",
        count: 1,
      };

      const { data, status } = await request("post", "", input);
      badRequestResponse(data, status);
    });
    it("return 400 for bad input - name too long", async () => {
      const input = {
        name: "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
        count: 1,
      };

      const { data, status } = await request("post", "", input);
      badRequestResponse(data, status);
    });
    it("return 400 for bad input - no count", async () => {
      const input = {
        name: "Test Court",
      };

      const { data, status } = await request("post", "", input);
      badRequestResponse(data, status);
    });
    it("return 400 for bad input count too small", async () => {
      const input = {
        name: "Test Court",
        count: 0,
      };

      const { data, status } = await request("post", "", input);
      badRequestResponse(data, status);
    });
    it("return 400 for bad input count too large", async () => {
      const input = {
        name: "Test Court",
        count: 100,
      };

      const { data, status } = await request("post", "", input);
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
        updatedCourt,
      );
      goodResponse(data, status);

      const [dbCourt] = await getCourts();
      assert.deepStrictEqual(dbCourt, data.data, "Expected correct response");
      assert.deepStrictEqual(
        { ...updatedCourt, _id: COURT_ID },
        data.data,
        "expected correct data to be saved",
      );
    });
    it("should throw 400 for bad id", async () => {
      const { data, status } = await request("put", "/badid", {
        name: "tee",
        count: mockCourts[0].count,
      });

      badRequestResponse(data, status);
    });
    it("should throw 400 - no keys", async () => {
      const { data, status } = await request("put", `/${COURT_ID}`, {});

      badRequestResponse(data, status);
    });
    it("should throw 404", async () => {
      const { data, status } = await request("put", `/${BAD_ID}`, {
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
        updatedCourt,
      );

      goodResponse(data, status);

      const [dbCourt] = await getCourts();
      assert.deepStrictEqual(dbCourt, data.data, "Expected correct response");
      assert.deepStrictEqual(dbCourt, {
        ...EXPECTED_COURT,
        ...updatedCourt,
      });
    });
    it("happy path count", async () => {
      const updatedCourt = {
        count: mockCourts[0].count,
      };

      const { data, status } = await request(
        "patch",
        `/${COURT_ID}`,
        updatedCourt,
      );

      goodResponse(data, status);

      const [dbCourt] = await getCourts();
      assert.deepStrictEqual(dbCourt, data.data, "Expected correct response");
      assert.deepStrictEqual(dbCourt, {
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
        updatedCourt,
      );

      goodResponse(data, status);

      assert.deepStrictEqual(
        EXPECTED_COURT,
        data.data,
        "Expected correct response",
      );
    });
    it("should throw 400 for bad id", async () => {
      const { data, status } = await request("patch", "/badid", {
        name: "testing",
      });

      badRequestResponse(data, status);
    });
    it("should throw 404", async () => {
      const { data, status } = await request("patch", `/${BAD_ID}`, {
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

      assert.deepStrictEqual(
        EXPECTED_COURT,
        data.data,
        "Expected correct response",
      );
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
