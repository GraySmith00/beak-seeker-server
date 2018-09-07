const express = require('express');
const app = express();

const helmet = require('helmet');
const morgan = require('morgan');
const users = require('./routes/users');
const home = require('./routes/home');
const mongoose = require('mongoose');
const passport = require('passport');

// Passport config
const passportConfig = require('./config/passport');

// DB config
const db = require('./config/keys').mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

if (app.get('env') === 'development') {
  app.use(morgan('dev'));
  console.log('Morgan enabled...');
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // key=value&key=value
app.use(express.static('public'));
app.use(helmet());

// Routes
app.use('/api/users', users);
app.use('/', home);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
