const express = require('express');
const router = express.Router();
const passport = require('passport');
const Joi = require('joi');

var Twitter = require('twitter');

const User = require('../models/User');

// REQUEST TOKEN
router.get('/login', passport.authenticate('twitter'));

// TOKEN RETURN
router.get(
  '/return',
  passport.authenticate('twitter', { session: false }),
  async (req, res) => {
    const { _id } = req.user;
    return res.redirect(`https://beakseeker.herokuapp.com/home?id=${_id}`);
  }
);

// POST TWEET
router.post('/posttweet', async (req, res) => {
  const user = await User.findById(req.body.userId).select('twitterProvider');

  const client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: user.twitterProvider.token,
    access_token_secret: user.twitterProvider.tokenSecret
  });

  client
    .post('statuses/update', {
      status: req.body.status
    })
    .then(function(tweet) {
      console.log(tweet);
    })
    .catch(function(error) {
      console.log(error.message);
    });
});

const validateUser = user => {
  const schema = {
    name: Joi.string()
      .min(2)
      .required(),
    twitterProvider: Joi.object().keys({
      twitter_id: Joi.string()
    }),
    image: Joi.string()
  };
  return Joi.validate(user, schema);
};

module.exports = router;
