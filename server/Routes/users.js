const express = require('express');
const router = express.Router();
const User = require('../models/user'); // 确保路径正确
const bcrypt = require('bcryptjs');

// 注册新用户的路由处理器
router.post('/register', async (req, res) => {
  console.log('Register endpoint called with body:', req.body); // 日志请求体内容

  try {
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log('Email already in use:', req.body.email); // 如果邮箱已被使用，记录日志
      return res.status(400).send('Email already in use');
    }

    // 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log('Password was hashed'); // 记录密码已经被哈希处理

    // 创建新用户对象
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // 保存用户到数据库
    await user.save();
    console.log('User registered successfully:', user); // 记录用户成功注册的日志

    // 发送成功响应
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error during registration:', error); // 记录异常的日志
    res.status(500).send('Server error');
  }
});

// 用户登录的路由处理器
router.post('/login', async (req, res) => {
  console.log('Login endpoint called with body:', req.body); // 日志请求体内容

  try {
    // 查找用户
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log('User not found with email:', req.body.email); // 如果用户不存在，记录日志
      return res.status(400).send('Invalid email or password');
    }

    // 验证密码
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      console.log('Invalid password for user:', req.body.email); // 如果密码不匹配，记录日志
      return res.status(400).send('Invalid email or password');
    }

    // 发送成功响应
    res.status(200).send('Login successful');
  } catch (error) {
    console.error('Error during login:', error); // 记录异常的日志
    res.status(500).send('Server error');
  }
});

module.exports = router;
