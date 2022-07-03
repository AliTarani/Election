const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


const Election = mongoose.model('Elections', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 60
  },
  cover: {
    type: String,
  },
  endDate: {
    type: String,
  },
  startDate: {
    type: String,
  },
  voteLimit: {
    type: Number,
    maxlength: 2,
  },
  active: {
    type: Boolean,
    default: true
  },
  voted: {
    type: Boolean,
    default: false
  },
  condidates: [
    {
      type: ObjectId,
      ref: "Condidates"
    }
  ]
}));

module.exports = Election;