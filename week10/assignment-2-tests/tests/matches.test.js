const assert = require("assert");

const {
  goodResponse,
  notFoundResponse,
  badRequestResponse,
  convertJSON,
  requestFactory,
} = require("./helpers");
const { createMatch, getMatches, getMatchesRaw, createCourt } = require("./db");
const { mockMatches, MOCK_MATCH_ID } = require("./mocks/match");
const { mockCourts, MOCK_COURT_ID } = require("./mocks/court");

const MATCH_ID = MOCK_MATCH_ID.toString();
const COURT_ID = MOCK_COURT_ID.toString();
const BAD_ID = "123412341234123412341234";

const EXPECTED_MATCH = convertJSON({
  ...mockMatches[0],
  court: mockCourts[0],
});
const request = requestFactory("/api/matches");

describe("MATCH RESOURCE", () => {
  describe("getAll", () => {
    beforeEach(async () => {
      await createCourt(mockCourts[0]);
      await Promise.all(mockMatches.map(createMatch));
    });
    it("happy path", async () => {
      const { data, status } = await request("get", "/");

      goodResponse(data, status);
      assert(Array.isArray(data.data), "Expected data to be an array");

      const dbMatches = await getMatches();
      assert.deepStrictEqual(
        data.data,
        dbMatches,
        "Expected to get the matches from the db",
      );
    });
  });

  describe("getOne", async () => {
    beforeEach(async () => {
      await createCourt(mockCourts[0]);
      await createMatch(mockMatches[0]);
    });
    it("happy path", async () => {
      const { data, status } = await request("get", `/${MATCH_ID}`);
      const [dbMatch] = await getMatches();

      goodResponse(data, status);
      assert.deepStrictEqual(dbMatch, data.data, "Expected correct response");
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
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2: "player2",
        sets: [...mockMatches[0].sets],
        winner: "player2",
      };

      const { data, status } = await request("post", "/", newMatch);
      assert.strictEqual(status, 201, "Expected status 201");
      assert("data" in data, "Expected key of `data`");

      const [dbMatch] = await getMatchesRaw();
      assert.deepStrictEqual(dbMatch, data.data, "Expected update to be saved");

      delete data.data._id;
      assert.deepStrictEqual(
        newMatch,
        data.data,
        "Expect correct data to be returnd",
      );
    });
    it("should throw 400 for empty", async () => {
      const { data, status } = await request("post", "/", {});

      badRequestResponse(data, status);
    });
    it("should throw 400 for invalid player1", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "s",
        player2: "player2",
        sets: [...mockMatches[0].sets],
        winner: "player1",
      };
      const { data, status } = await request("post", "/", newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for invalid player2", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2:
          "thisnameiswaytoolongitshouldbelessthan64charactersnotmoreotherwiseitwillfail",
        sets: [...mockMatches[0].sets],
        winner: "player1",
      };
      const { data, status } = await request("post", "/", newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for not enough sets", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2: "player2",
        sets: [[1, 1]],
        winner: "player1",
      };
      const { data, status } = await request("post", "/", newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for too many sets", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2: "s",
        sets: [
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
        ],
        winner: "player1",
      };
      const { data, status } = await request("post", "/", newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for not enough points", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2: "s",
        sets: [[], []],
        winner: "player1",
      };
      const { data, status } = await request("post", "/", newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for too many points", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2: "s",
        sets: [
          [2, 1],
          [2, 2, 2],
        ],
        winner: "player1",
      };
      const { data, status } = await request("post", "/", newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for wrong winner", async () => {
      const { data, status } = await request("post", "/", {
        court: COURT_ID,
        player1: "player1",
        player2: "player2",
        sets: [
          [4, 0],
          [4, 0],
        ],
        winner: "player2",
      });

      badRequestResponse(data, status);
    });
  });

  describe("replace", () => {
    beforeEach(async () => {
      await createCourt(mockCourts[0]);
      await createMatch(mockMatches[0]);
    });
    it("happy path", async () => {
      const updatedMatch = {
        court: COURT_ID,
        player1: "update-player1",
        player2: "update-player2",
        sets: [...mockMatches[0].sets],
        winner: "update-player2",
      };

      const { data, status } = await request(
        "put",
        `/${MATCH_ID}`,
        updatedMatch,
      );
      goodResponse(data, status);

      const [dbMatch] = await getMatches();
      assert.deepStrictEqual(dbMatch, data.data, "Expected correct response");
      assert.deepStrictEqual(
        { ...updatedMatch, court: EXPECTED_MATCH.court, _id: MATCH_ID },
        data.data,
        "expected correct data to be saved",
      );
    });
    it("should throw 400 for empty", async () => {
      const { data, status } = await request("put", `/${MATCH_ID}`, {});

      badRequestResponse(data, status);
    });
    it("should throw 400 for invalid player1", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "s",
        player2: "player2",
        sets: [...mockMatches[0].sets],
        winner: "player1",
      };
      const { data, status } = await request("put", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for invalid player2", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2:
          "thisnameiswaytoolongitshouldbelessthan64charactersnotmoreotherwiseitwillfail",
        sets: [...mockMatches[0].sets],
        winner: "player1",
      };
      const { data, status } = await request("put", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for not enough sets", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2: "player2",
        sets: [[1, 1]],
        winner: "player1",
      };
      const { data, status } = await request("put", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for too many sets", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2: "s",
        sets: [
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
        ],
        winner: "player1",
      };
      const { data, status } = await request("put", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for not enough points", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2: "s",
        sets: [[], []],
        winner: "player1",
      };
      const { data, status } = await request("put", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for too many points", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2: "s",
        sets: [
          [2, 2, 2],
          [2, 1],
        ],
        winner: "player1",
      };
      const { data, status } = await request("put", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for wrong winner", async () => {
      const newMatch = {
        court: COURT_ID,
        player1: "player1",
        player2: "player2",
        sets: [
          [4, 0],
          [4, 0],
        ],
        winner: "player2",
      };
      const { data, status } = await request("put", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for bad id", async () => {
      const { data, status } = await request("put", "/badid", {
        sets: [...mockMatches[0].sets],
        court: COURT_ID,
      });
      badRequestResponse(data, status);
    });
    it("should throw 404", async () => {
      const { data, status } = await request("put", `/${BAD_ID}`, {
        court: COURT_ID,
        player1: "player1",
        player2: "player2",
        sets: [...mockMatches[0].sets],
        winner: "player2",
      });

      notFoundResponse(data, status);
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await createCourt(mockCourts[0]);
      await createMatch(mockMatches[0]);
    });
    it("happy path name", async () => {
      const updatedMatch = {
        player1: "Edit",
      };

      const { data, status } = await request(
        "patch",
        `/${MATCH_ID}`,
        updatedMatch,
      );

      goodResponse(data, status);

      const [dbMatch] = await getMatches();
      assert.deepStrictEqual(dbMatch, data.data, "Expected correct response");
      assert.deepStrictEqual(dbMatch, { ...EXPECTED_MATCH, player1: "Edit" });
    });
    it("happy path sets", async () => {
      const updatedMatch = {
        sets: [...mockMatches[0].sets],
      };

      const { data, status } = await request(
        "patch",
        `/${MATCH_ID}`,
        updatedMatch,
      );

      goodResponse(data, status);

      const [dbMatch] = await getMatches();
      assert.deepStrictEqual(dbMatch, data.data, "Expected correct response");
      assert.deepStrictEqual(dbMatch, { ...EXPECTED_MATCH, ...updatedMatch });
    });
    it("should not allow random keys", async () => {
      const updatedMatch = {
        script: "malware",
      };

      const { data, status } = await request(
        "patch",
        `/${MATCH_ID}`,
        updatedMatch,
      );

      goodResponse(data, status);

      assert.deepStrictEqual(
        EXPECTED_MATCH,
        data.data,
        "Expected correct response",
      );
    });
    it("should throw 400 for bad id", async () => {
      const { data, status } = await request("patch", "/badid", {
        player1: "test",
      });
      badRequestResponse(data, status);
    });
    it("should throw 400 for invalid player1", async () => {
      const newMatch = {
        player1: "s",
      };
      const { data, status } = await request("patch", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for invalid player2", async () => {
      const newMatch = {
        player2:
          "thisnameiswaytoolongitshouldbelessthan64charactersnotmoreotherwiseitwillfail",
      };
      const { data, status } = await request("patch", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for not enough sets", async () => {
      const newMatch = {
        sets: [[1, 1]],
      };
      const { data, status } = await request("patch", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for too many sets", async () => {
      const newMatch = {
        sets: [
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
        ],
      };
      const { data, status } = await request("patch", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for not enough points", async () => {
      const newMatch = {
        sets: [[], []],
      };
      const { data, status } = await request("patch", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for too many points", async () => {
      const newMatch = {
        sets: [
          [2, 2, 2],
          [2, 1],
        ],
      };
      const { data, status } = await request("patch", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 400 for wrong winner", async () => {
      const newMatch = {
        winner: "player3",
      };
      const { data, status } = await request("patch", `/${MATCH_ID}`, newMatch);

      badRequestResponse(data, status);
    });
    it("should throw 404", async () => {
      const { data, status } = await request("patch", `/${BAD_ID}`, {
        player1: "test",
      });

      notFoundResponse(data, status);
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await createCourt(mockCourts[0]);
      await createMatch(mockMatches[0]);
    });

    it("happy path", async () => {
      const { data, status } = await request("delete", `/${MATCH_ID}`);

      goodResponse(data, status);

      assert.deepStrictEqual(
        EXPECTED_MATCH,
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
