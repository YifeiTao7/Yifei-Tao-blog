// user.routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // 确保路径正确
const router = express.Router();

// 注册路由
router.post('/register', async (req, res) => {
  try {
    // 检查邮箱是否已经被注册
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // 创建新用户
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    // 保存到数据库
    await newUser.save();

    // 返回成功响应
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering new user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    // 查找用户
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 验证密码
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 生成 JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email }, // 在JWT中也包含电子邮件
      process.env.JWT_SECRET || 'your_default_secret',
      { expiresIn: '1h' }
    );

    // 如果密码验证成功，返回成功响应、用户名、电子邮件和 token
    res.status(200).json({
      message: 'Login successful',
      username: user.username,
      email: user.email,  // 确保这里返回了电子邮件
      token: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in user' });
  }
});


module.exports = router;