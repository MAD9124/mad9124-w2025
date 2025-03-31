const TokenService = require('../services/token');
const { UnauthorizedError } = require('./errors');

const isAuthenticated = (req, res, next) => {
  // Authorization: Bearer [token]
  const rawToken = req.headers.authorization;
  if (!rawToken) throw new UnauthorizedError('Unauthorized');
  const token = rawToken.replace('Bearer ', '');

  const user = TokenService.verify(token);
  req.user = user;
  next();
};

module.exports = isAuthenticated;
