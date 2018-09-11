const express = require('express');
const router = express.Router();
const passport = require('passport');
const Joi = require('joi');

router.get('/login', passport.authenticate('twitter'));

router.get(
  '/return',
  passport.authenticate('twitter', { session: false }),
  async (req, res) => {
    const { _id } = req.user;
    console.log(_id);
    res.redirect(`http://localhost:3000/home?id=${_id}`);
    // res.send(req.user);
  }
);

const validateUser = user => {
  const schema = {
    name: Joi.string()
      .min(2)
      .required(),
    email: Joi.string()
      .min(3)
      .required(),
    twitterProvider: Joi.object().keys({
      twitter_id: Joi.string()
    }),
    image: Joi.string()
  };
  return Joi.validate(user, schema);
};

module.exports = router;
