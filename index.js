const express = require('express');
const app = express();
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:startup');
const users = require('./routes/users');
const home = require('./routes/home');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // key=value&key=value
app.use(express.static('public'));
app.use(helmet());

// Routes
app.use('/api/users', users);
app.use('/', home);

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  debug('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
