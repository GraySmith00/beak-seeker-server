const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

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
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const user = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(user);
  res.send(user);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(user => {
    return user.id === parseInt(req.params.id);
  });
  if (!user) {
    res.status(404).send('The user with the given ID was not found :(');
  }
  res.send(user);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
