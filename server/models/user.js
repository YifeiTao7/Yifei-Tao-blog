const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 定义字段
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
  // 其他字段...
});

const User = mongoose.model('User', userSchema, 'users'); // 第三个参数指定集合名，如果省略，默认为模型名的小写复数形式
module.exports = User;
