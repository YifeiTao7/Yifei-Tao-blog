const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  id: Number,
  category: String,
  imageUrl: String,
  title: String,
  projectDetailsUrl: String
});

// 注意这里传入了集合名称 'portfolio'
const Portfolio = mongoose.model('Portfolio', portfolioSchema, 'portfolio');

module.exports = Portfolio;
