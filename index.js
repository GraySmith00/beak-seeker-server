const express = require('express');
const app = express();
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:startup');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // key=value&key=value
app.use(express.static('public'));
app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  debug('Morgan enabled...');
}

const users = [
  { id: 1, name: 'Gray' },
  { id: 2, name: 'Paul' },
  { id: 3, name: 'Mike' },
  { id: 4, name: 'Tim' }
];

app.get('/', (req, res) => {
  res.send('hello world!!!!');
});

app.get('/api/users', (req, res) => {
  if (!users) {
    res.status(404).send('No users were found :(');
  }
  res.send(users);
});

app.post('/api/users', (req, res) => {
  // validate
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // create user
  const user = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(user);

  // return newly created user
  res.send(user);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(user => {
    return user.id === parseInt(req.params.id);
  });
  if (!user) {
    return res.status(404).send('The user with the given ID was not found :(');
  }
  res.send(user);
});

app.put('/api/users/:id', (req, res) => {
  // find the user
  const user = users.find(user => {
    return user.id === parseInt(req.params.id);
  });
  if (!user) {
    return res.status(404).send('The user with the given ID was not found :(');
  }

  // validate
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // update user
  user.name = req.body.name;

  // return updated user
  res.send(user);
});

app.delete('/api/users/:id', (req, res) => {
  // look up the user
  const user = users.find(user => {
    return user.id === parseInt(req.params.id);
  });

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
      .min(3)
      .required()
  };
  return Joi.validate(user, schema);
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
