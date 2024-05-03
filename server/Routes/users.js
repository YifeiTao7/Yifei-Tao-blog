// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'img', 'avatar');
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

const Statistic = require('../models/Statistic');

router.post('/register', upload.single('avatar'), async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const avatarPath = req.file ? path.join('/assets/img/avatar', req.file.filename) : '';

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: avatarPath
    });

    const savedUser = await newUser.save();
    await updateStatistic("Active Users", 1);
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      username: savedUser.username,
      avatar: savedUser.avatar
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering new user" });
  }
});

async function updateStatistic(title, increment) {
  const statistic = await Statistic.findOneAndUpdate(
    { title: title },
    { $inc: { count: increment } },
    { new: true, upsert: true }
  );
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      token,
      username: user.username,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
