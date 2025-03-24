const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../middleware/errors');

const { JWT_SECRET } = process.env;

const sign = (user) =>
  jwt.sign({ id: user._id.toString(), name: user.name }, JWT_SECRET, {
    expiresIn: '30s',
  });

const verify = (token) => {
  try {
    const user = jwt.verify(token, JWT_SECRET);
    return user;
  } catch (err) {
    throw new UnauthorizedError('Unauthenticated');
  }
};

module.exports = {
  sign,
  verify,
};
