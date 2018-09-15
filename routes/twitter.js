const express = require('express');
const router = express.Router();
const passport = require('passport');
const Joi = require('joi');
const twitterKeys = require('../config/twitterKeys');

var Twitter = require('twitter');

const User = require('../models/User');

// var client = new Twitter(twitterKeys);
// var params = { screen_name: 'Redpillrevival' };
// client.get('statuses/user_timeline', params, function(error, tweets, response) {
//   if (!error) {
//     console.log(tweets);
//   }
// });

// REQUEST TOKEN
router.get('/login', passport.authenticate('twitter'));

// TOKEN RETURN
router.get(
  '/return',
  passport.authenticate('twitter', { session: false }),
  async (req, res) => {
    const { _id } = req.user;
    res.redirect(`http://localhost:3000/home?id=${_id}`);
    // res.send(req.user);
  }
);

// POST TWEET
router.post('/posttweet', async (req, res) => {
  const user = await User.findById(req.body.userId).select('twitterProvider');

  const client = new Twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
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
