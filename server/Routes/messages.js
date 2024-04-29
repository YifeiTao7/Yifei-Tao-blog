// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// 提交留言
router.post('/submit/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const { username, message, avatarUrl } = req.body;  // 接收 avatarUrl
  
  try {
    const newMessage = new Message({
      projectId,
      username,
      message,
      avatarUrl  // 保存头像URL
    });
    await newMessage.save();
    res.status(201).json({ message: 'Message submitted successfully' });
  } catch (error) {
    console.error('Error submitting message:', error);
    res.status(500).json({ message: 'Error submitting message' });
  }
});

// 获取特定项目的留言
router.get('/:projectId', async (req, res) => {
  const { projectId } = req.params;
  
  try {
    const messages = await Message.find({ projectId }).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;
