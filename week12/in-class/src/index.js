'use strict';

require('dotenv/config');
const compression = require('compression');
// const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const expressMongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const morgan = require('morgan');

const { errorHandler } = require('./middleware/errors');
const sanitizeBody = require('./middleware/sanitizeBody');
const { connect } = require('./models/db');
const authRouter = require('./routers/auth');
const studentRouter = require('./routers/students');
const logger = require('./util/logger');
const isAuthenticated = require('./middleware/isAuthenticated');
require('./util/passport');

connect();

const app = express();

app.use(
  cors({
    origin: (process.env.CORS_ALLOWLIST || '').split(','),
    // credentials: true,
  })
);

// app.use(cookieParser());
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(compression());
}

app.use(express.json());
app.use(morgan('tiny'));
app.use(expressMongoSanitize());
app.use(sanitizeBody);
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

app.use('/auth', authRouter);
app.use('/api/students', isAuthenticated, studentRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    logger.error('Something went wrong', err);
    return;
  }
  logger.debug(`Server running at ${PORT}`);
});
