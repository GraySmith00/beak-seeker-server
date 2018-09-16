const express = require('express');
const router = express.Router();
const Joi = require('joi');

// Load User Model
const User = require('../models/User');

router.get('/', async (req, res) => {
  const users = await User.find();
  if (users.length < 1) {
    res.status(404).send('No users were found :(');
  }
  res.send(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send('The user with the given ID was not found :(');
  }
  res.json(user);
});

router.put('/:id', async (req, res) => {
  // find the user
  const user = await User.findById(req.body._id);
  if (!user) {
    return res.status(404).send('The user with the given ID was not found :(');
  }

  // update user
  User.findOneAndUpdate(
    { _id: req.body._id },
    { $set: { sightings: req.body.sightings } },
    { new: true },
    (err, newUser) => {
      if (err) {
        console.log(err);
      }
    }
  );
});

router.delete('/:id', async (req, res) => {
  // look up the user
  const user = await User.findById(req.params.id);

  // doesn't exist, return 404
  if (!user) {
    return res.status(404).send('The user with the given ID was not found :(');
  }

  // Delete user
  const index = users.indexOf(user);
  users.splice(index, 1);

  // Return the user
  res.send(user);
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

// router.post('/', async (req, res) => {
//   // validate
//   const { error } = validateUser(req.body);
//   if (error) {
//     return res.status(400).send(error.details[0].message);
//   }

//   const foundUser = await User.findOne({ email: req.body.email });
//   if (foundUser) return res.status(400).json({ email: 'Email already exists' });

//   // create user
//   const newUser = new User({
//     name: req.body.name,
//     email: req.body.email
//   });

//   // return newly created user
//   try {
//     const user = await newUser.save();
//     res.json(user);
//   } catch (error) {
//     console.log(error);
//   }
// });
