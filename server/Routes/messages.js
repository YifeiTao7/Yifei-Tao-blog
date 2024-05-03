// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');


router.post('/submit/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const { username, message, avatarUrl } = req.body;
  
  try {
    const newMessage = new Message({
      projectId,
      username,
      message,
      avatarUrl 
    });
    await newMessage.save();
    res.status(201).json({ message: 'Message submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting message' });
  }
});


router.get('/:projectId', async (req, res) => {
  const { projectId } = req.params;
  
  try {
    const messages = await Message.find({ projectId }).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;
