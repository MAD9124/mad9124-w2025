'use strict';

const express = require('express');

const studentRouter = require('./routers/students');

const app = express();

app.use(express.json());

app.use('/api/students', studentRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.error('Something went wrong', err);
    return;
  }
  console.log(`Server running at ${PORT}`);
});
