// routes/statistics.js
const express = require('express');
const router = express.Router();
const Statistic = require('../models/Statistic');

// 获取所有统计数据
router.get('/', async (req, res) => {
  try {
    const statistics = await Statistic.find();
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新的统计数据
router.post('/', async (req, res) => {
  const { title, count, description, icon } = req.body;
  const statistic = new Statistic({
    title,
    count,
    description,
    icon
  });

  try {
    const newStatistic = await statistic.save();
    res.status(201).json(newStatistic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新统计数据，通过 title 字段识别
router.put('/update-by-title', async (req, res) => {
  const { title, count } = req.body;
  try {
    const statistic = await Statistic.findOne({ title: title });
    if (!statistic) {
      return res.status(404).json({ message: "Statistic not found" });
    }

    // 更新统计数据的数量
    statistic.count = count;
    const updatedStatistic = await statistic.save();

    res.json(updatedStatistic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
