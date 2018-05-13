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

So, bcrypt works in 2 steps, first genSalt and then hash the password with that salt
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

//Function to generate random photos. To create custom method, start with UserSchema.method
UserSchema.methods.gravatar = function (size) {

  // If size of the picture is not set, then set it to 200
  if(!size) size = 200;

  // if the email does not exist, then return the picture via the url (https://gravatar.com/avatar/?s=200&d=wavatar)
  if(!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=wavatar';

  // Elset, if the email exists, create md5 hash from that email string. The single liner is -
  // require('crypto').createHash('md5').update('text to hash').digest('hex');
  let md5 = crypto.createHash('md5').update('this.email').digest('hex');

  // And then get the picture from that hexed email. Meaning this specific photo belongs to only this specific email
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=wavatar';

}

module.exports = mongoose.model('User', UserSchema);

