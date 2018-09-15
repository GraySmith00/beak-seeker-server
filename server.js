const express = require('express');
const app = express();

const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const TwitterStrategy = require('passport-twitter').Strategy;
const bodyParser = require('body-parser');

const users = require('./routes/users');
const twitter = require('./routes/twitter');

const CONSUMER_KEY = require('./keys').CONSUMER_KEY;
const CONSUMER_SECRET = require('./keys').CONSUMER_SECRET;

// CORS
// app.all('/*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With');
//   next();
// });
app.use(
  cors({
    allowedOrigins: ['localhost:3000']
  })
);
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport  & Sesson config
app.use(session({ resave: false, saveUninitialized: true, secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new TwitterStrategy(
    {
      consumerKey: CONSUMER_KEY,
      consumerSecret: CONSUMER_SECRET,
      callbackURL: 'http://localhost:5000/twitter/return',
      includeEmail: true
    },
    // function(token, tokenSecret, profile, callback) {
    //   return callback(null, profile);
    // },
    function(token, tokenSecret, profile, done) {
      User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
        return done(err, user);
      });
    }
  )
);

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((obj, callback) => {
  callback(null, obj);
});

// DB config
const db = require('./config/keys').mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
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
app.use('/twitter', twitter);

app.get('/', (req, res) => {
  res.send('working!!!!');
});

// Running the Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
