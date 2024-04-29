// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {   // 新增头像字段
    type: String,
    default: ''
  },
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
