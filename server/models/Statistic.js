// models/Statistic.js
const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema({
  title: { type: String, required: true },
  count: { type: Number, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }
});

const Statistic = mongoose.model('Statistic', statisticSchema);

module.exports = Statistic;
