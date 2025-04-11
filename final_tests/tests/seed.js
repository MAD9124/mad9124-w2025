const { disconnect, createCrap } = require("./db");
const { createUser } = require("./db/users");

const { mockUsers } = require("./mocks/user");
const { mockCrap } = require("./mocks/crap");
const seed = async () => {
  await Promise.all([
    createUser(mockUsers[0]),
    createUser(mockUsers[1]),
    await Promise.all(mockCrap.map(createCrap)),
  ]);

  await disconnect();
};

if (process.env.NODE_ENV !== "test") {
  seed();
}
