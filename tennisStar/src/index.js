require("dotenv/config");
const express = require("express");
const morgan = require("morgan");

const db = require("./models/db");
const courtsRouter = require("./routers/courts");
const matchesRouter = require("./routers/matches");
const { errorHandler } = require("./middleware/errors");

db.connect();

const app = express();

app.use(morgan("tiny"));
app.use(express.json());

app.use("/api/courts", courtsRouter);
app.use("/api/matches", matchesRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server listening on port ${PORT}`);
});
