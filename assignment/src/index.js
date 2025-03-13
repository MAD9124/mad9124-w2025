const express = require("express");

const matchRouter = require("./routers/matches");

const app = express();

app.use(express.json());

app.use("/api/matches", matchRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server listening on port ${PORT}`);
});
