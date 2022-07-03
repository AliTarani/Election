const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  melliCode: {
    type: String,
    match: /^\d{10}$/,
    required: true,
    unique: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    match: /^[0-9]*$/,
    minlength: 10,
    maxlength: 15,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  profileImage: {
    type: String,
    default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAAsElEQVQ4jc3QMWoCcRDF4S8xLljZpYkWC8lp9hIK3sQU5go5gWgrgRQWQi5gbbMK6w3sLRxB0Cx/twj5wTTvvRlmhv9Khg/sUWESWjITLPCCHr5CS6aKxjP90K54vGfqLVq/6M8YYYUuPvGNZergzOnmSsMnNuYBBaYocYgqQyvqmtuYY40BcnSicgzDm0X2inenR9XdmkVmfMvc4bVuxeAtsuDpwthikzAAfhJzf8AR0VAenyvn7CsAAAAASUVORK5CYII='
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  elections: [
    {
      election: {
        type: ObjectId,
        ref: "Elections"
      },
      votes: [{ type: ObjectId, ref: "Condidates" }]
    }

  ]
})






userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      melliCode: this.melliCode,
      isAdmin: this.isAdmin,
      // profileImage: this.profileImage
    },
    config.get('jwtPrivateKey'));
  return token;
}

userSchema.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
  return password;
}

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);

}


const User = mongoose.model('Users', userSchema);

module.exports = User;