const express = require('express');

const walkRouter = require('./routers/walk');
const { errorHandler } = require('./utils/errors');

const app = express();
app.use(express.json());

app.use('/api/walk', walkRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
