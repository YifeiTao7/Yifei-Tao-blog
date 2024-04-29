const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  imageUrls: [{ type: String, required: true }], // 存储项目封面和截图的图像 URL 数组
  description: { type: String, required: true },
  technologies: [String], // 使用的技术栈或工具的字符串数组
  startDate: Date,
  endDate: Date,
  role: String,
  githubUrl: String,
  liveDemoUrl: String
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
