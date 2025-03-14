const { dropDbs, disconnect } = require(".");

dropDbs().then(() => disconnect());
