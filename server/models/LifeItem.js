const mongoose = require('mongoose');

const lifeItemSchema = new mongoose.Schema({
  category: { type: String, required: true }, // 新增类别字段
  image: { type: String, required: true },
  name: { type: String, required: true },
  quote: { type: String, required: true }
});

const LifeItem = mongoose.model('LifeItem', lifeItemSchema);
module.exports = LifeItem;
