const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  imageUrls: [{ type: String, required: true }],
  description: { type: String, required: true },
  technologies: [String],
  startDate: Date,
  endDate: Date,
  role: String,
  githubUrl: String,
  liveDemoUrl: String,
  likes: { type: Number, default: 0 }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
