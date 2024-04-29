const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  avatarUrl: {       // 添加头像URL字段
    type: String,
    required: false  // 标记为非必需，因为可能存在未设置头像的用户
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
