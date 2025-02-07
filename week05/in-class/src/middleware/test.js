const testMiddleware = (req, _res, next) => {
  req.isFromChrome =
    req.headers['sec-ch-ua']?.includes('Google Chrome') ?? false;
  next();
};

module.exports = testMiddleware;
