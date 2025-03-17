const requestHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  requestHandler,
};
