const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    email: {type: String, unique: true, lowercase: true},
    name: String,
    password: String,
    photo: String,
    tweets: [{
      tweet: { type: Schema.Types.ObjectId, ref: 'Tweet' }
    }]
});

/* Now code the middleware - also known as “pre” and “post” hooks that tie particular functions to particular lifecycle and query events. This middleware is defined on the schema level and can modify the query or the document itself as it is executed. Middleware is invoked with two arguments: the event trigger (as a string) and the callback function that is triggered for that particular event. The callback itself takes in an argument of a function, which we typically call next , and when invoked — advances the document/query to the next awaiting middleware.
So what the below function does is - before (i.e. pre) user saves the normal text password into the database, making sure it encrypts it first
 */
UserSchema.pre('save', function(next) {
  let user = this; // This is how I access UserSchema object

  // I shall only hash the password if it has been modified (or is new). So, in below line I make sure if there was already a password and isModified in not true, then move-on with next()
  if(!user.isModified('password')) return next();

  // and for new password
  if(user.password) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return next(err);
        user.passwrod = hash;
        next(err);
      });
    });
  }
});

module.exports = mongoose.model('User', UserSchema);

