const { Router } = require('express');
const passport = require('passport');

const authRouter = Router();

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile'] })
);
authRouter.get('/google/callback', (req, res) => {
  console.log('we are back baby', req.query);
});

module.exports = authRouter;
