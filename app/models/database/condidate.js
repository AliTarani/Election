const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const Condidate = mongoose.model('Condidates', new mongoose.Schema({
  election: {
    type: ObjectId,
    ref: "Elections",
    required: true
  },
  user: {
    type: ObjectId,
    ref: "Users",
    required: true
  },
  slogan: {
    type: String,
    minlength: 5,
    maxlength: 100
  },
  promisses: [
    {
      type: String,
      minlength: 5,
      maxlength: 200
    }
  ],
  education: [
    {
      type: String,
      minlength: 5,
      maxlength: 200
    }
  ],
  bio: {
    type: String,
    minlength: 5,
    maxlength: 300
  },
  votes: [
    {
      type: ObjectId,
      ref: "Users",
    }
  ]
}));

module.exports = Condidate;