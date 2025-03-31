const tokenService = require('../services/token');

const callback = (req, res, next) => {
  try {
    const { state } = req.query;

    // decode the state property if it exists
    const { redirect_url } = state
      ? JSON.parse(Buffer.from(state, 'base64').toString())
      : {};
    const token = tokenService.sign(req.user);
    if (redirect_url) {
      res.redirect(`${redirect_url}?token=${token}`);
      return;
    }
    res.redirect(`/?token=${token}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  callback,
};
