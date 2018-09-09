const express = require('express');
const router = express.Router();
const passport = require('passport');
const Joi = require('joi');

const User = require('../models/User');

router.get('/', (req, res) => {
  res.send('hello twitter!!!!');
});

router.get('/login', passport.authenticate('twitter'));

router.get(
  '/return',
  passport.authenticate('twitter', { session: false }),
  async (req, res) => {
    res.json(req.user);

    // const { id_str, screen_name, email, profile_image_url } = req.user._json;

    // const parsedUserData = {
    //   name: screen_name,
    //   email,
    //   twitterProvider: {
    //     twitter_id: id_str
    //   },
    //   image: profile_image_url
    // };

    // const { error } = validateUser(parsedUserData);
    // if (error) {
    //   return res.status(400).send(error.details[0].message);
    // }

    // const newUser = new User(parsedUserData);

    // try {
    //   const user = await newUser.save();
    //   res.json(user);
    // } catch (error) {
    //   res.send(error.message);
    // }
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
