const { Router } = require('express');
const passport = require('passport');

const authController = require('../controllers/auth');

const authRouter = Router();

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile'] })
);
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
