// models/Skill.js
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'Cloud']
  },
  active: {
    type: Boolean,
    default: false
  }
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
