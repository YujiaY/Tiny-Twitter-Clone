const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    email: {type: String, unique: true, lowercase: treu},
    name: String,
    password: String,
    photo: String,
    tweets: [{
      tweet: { type: Scheme.Types.ObjectId, ref: 'Tweet' }
    }]
});

module.exports = mongoose.model('User', UserSchema);

