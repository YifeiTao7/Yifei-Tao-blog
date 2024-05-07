const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const User = require('../models/user');
const router = express.Router();

const credentials = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),  // 替换转义字符以正确处理多行私钥
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
};

// 初始化 Google Cloud Storage
const storage = new Storage({ credentials });

const bucket = storage.bucket('yifeitaoblogs');

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const Statistic = require('../models/Statistic');

router.post('/register', upload.single('avatar'), async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let avatarUrl = '';

    if (req.file) {
      const blob = bucket.file(`avatar/${Date.now()}-${req.file.originalname}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: { contentType: req.file.mimetype }
      });

      blobStream.on('error', err => res.status(500).json({ message: 'Failed to upload avatar', error: err.message }));
      blobStream.end(req.file.buffer);

      await new Promise(resolve => blobStream.on('finish', resolve));

      avatarUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      avatar: avatarUrl
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
    res.status(500).json({ message: "Error registering new user", error: error.message });
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

