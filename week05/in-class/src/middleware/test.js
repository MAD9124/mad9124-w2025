const testMiddleware = (req, res, next) => {
  console.log(req.headers);
  req.isFromChrome =
    req.headers['sec-ch-ua']?.includes('Google Chrome') ?? false;
  next();
};

module.exports = testMiddleware;
