const { Router } = require('express');
const passport = require('passport');

const authController = require('../controllers/auth');

const authRouter = Router();

authRouter.get('/google', (req, res, next) => {
  const { redirect_url } = req.query;
  let state;
  if (redirect_url) {
    state = Buffer.from(JSON.stringify({ redirect_url })).toString('base64');
  }
  console.log('r', redirect_url, state);
  passport.authenticate('google', { scope: ['profile'], state })(
    req,
    res,
    next
  );
});
authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    scope: ['profile'],
    failureRedirect: '/login',
    session: false,
  }),
  authController.callback
);

module.exports = authRouter;
