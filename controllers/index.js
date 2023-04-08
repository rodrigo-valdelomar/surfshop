const User = require("../models/user");
const passport = require('passport')
const { errorHandler } = require('../middleware')

module.exports = {
  async postRegister(req, res, next) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      image: req.body.image,
    });
    
    await User.register(newUser, req.body.password)
  },

  postLogin(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next);
  },

  getLogout(req, res, next) {
      req.logout(() => {
        errorHandler(next)
      });
      res.redirect('/');
  }
};
