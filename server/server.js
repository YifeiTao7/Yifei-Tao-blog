require('dotenv').config(); // 加载.env文件中的环境变量
const express = require('express');
const { connectToServer } = require('./db'); // 注意这里的路径
const userRoutes = require('./Routes/users'); // 用户路由
const portfolioRoutes = require('./Routes/portfolio'); // 投资组合路由，注意大小写应与文件夹名称相匹配
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 连接到 MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// 连接到数据库
connectToServer((err) => {
  if (err) {
    console.error('Unable to connect to MongoDB', err);
    process.exit();
  }

  // 使用用户和投资组合路由
  app.use('/api/users', userRoutes);
  app.use('/api/portfolio', portfolioRoutes); // 这里添加了投资组合路由

  // 错误处理
  app.use((req, res, next) => {
    res.status(404).send('Sorry, that route does not exist.');
  });
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // 服务器监听端口
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
