const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String
  },
  // email: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   unique: true,
  //   match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  // },
  twitterProvider: {
    type: {
      twitter_id: String
      // token: String
    },
    select: false
  },
  image: {
    type: String
  },
  username: {
    type: String
  },
  sightings: {
    type: Array
  }
});

UserSchema.statics.upsertTwitterUser = function(
  token,
  tokenSecret,
  profile,
  callback
) {
  let that = this;
  return this.findOne(
    {
      'twitterProvider.id': profile.id
    },
    function(err, user) {
      // no user was found, create a new one
      if (!user) {
        const newUser = new that({
          // email: profile.emails[0].value || null,
          username: profile.username,
          image: profile.photos[0].value,
          twitterProvider: {
            id: profile.id,
            token: token,
            tokenSecret: tokenSecret
          },
          sightings: []
        });

        // save the new user
        newUser.save((error, savedUser) => {
          if (error) {
            console.log(error);
          }
          return callback(error, savedUser);
        });
      } else {
        return callback(err, user);
      }
    }
  );
};

module.exports = User = mongoose.model('User', UserSchema);
