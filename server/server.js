require('dotenv').config(); // 加载.env文件中的环境变量
const express = require('express');
const { connectToServer } = require('./db'); // 注意这里的路径
const userRoutes = require('./Routes/users'); // 注意这里的路径
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));


// 中间件
app.use(express.json()); // 用于解析JSON请求体

// 连接到MongoDB
connectToServer((err) => {
  if (err) {
    console.error('Unable to connect to MongoDB', err);
    process.exit();
  }

  // 路由
  app.use('/api/users', userRoutes);

  // 捕获404错误和错误处理程序
  app.use((req, res, next) => {
    res.status(404).send('Sorry, that route does not exist.');
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // 监听端口
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
