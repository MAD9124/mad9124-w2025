const tokenService = require('../services/token');

const callback = (req, res, next) => {
  try {
    const token = tokenService.sign(req.user);
    res.redirect(`/?token=${token}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  callback,
};
