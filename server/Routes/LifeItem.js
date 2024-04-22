const express = require('express');
const LifeItem = require('../models/LifeItem'); // 确保这个路径匹配你的模型文件位置
const router = express.Router();

// 获取所有生活片段
router.get('/', async (req, res) => {
  try {
    const items = await LifeItem.find(); // 使用 mongoose 的 find 方法来获取所有文档
    res.json(items); // 返回查询到的数据
  } catch (err) {
    res.status(500).json({ message: err.message }); // 处理可能出现的错误
  }
});

// 获取特定类别的生活片段
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const items = await LifeItem.find({ category: category }); // 根据类别查询
    res.json(items); // 返回符合该类别的所有数据
  } catch (err) {
    res.status(500).json({ message: err.message }); // 错误处理
  }
});

// 创建一个新的生活片段
router.post('/add', async (req, res) => {
  const item = new LifeItem({
    image: req.body.image,
    name: req.body.name,
    quote: req.body.quote,
    category: req.body.category // 确保在创建时传入类别
  });

  try {
    const newItem = await item.save(); // 保存新创建的 LifeItem 实例到数据库
    res.status(201).json(newItem); // 返回成功状态码和新创建的项目
  } catch (err) {
    res.status(400).json({ message: err.message }); // 处理错误，比如模型验证失败
  }
});

// 导出 router 以便可以在其他文件如 app.js 中使用
module.exports = router;
