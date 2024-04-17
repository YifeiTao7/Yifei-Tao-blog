const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio'); // 确保路径正确

// 添加新项目的路由处理器
router.post('/add', async (req, res) => {
  console.log('Add project endpoint called with body:', req.body); // 记录请求体内容

  try {
    // 创建新项目对象
    const project = new Portfolio({
      title: req.body.title,
      category: req.body.category,
      imageUrl: req.body.imageUrl,
      projectDetailsUrl: req.body.projectDetailsUrl
    });

    // 保存项目到数据库
    await project.save();
    console.log('Project added successfully:', project); // 记录成功添加项目的日志

    // 发送成功响应
    res.status(201).send('Project added successfully');
  } catch (error) {
    console.error('Error adding project:', error); // 记录异常的日志
    res.status(500).send('Server error');
  }
});

// 获取所有项目的路由处理器
router.get('/all', async (req, res) => {
  try {
    // 从数据库中获取所有项目
    const projects = await Portfolio.find();
    console.log('Retrieved all projects:', projects); // 记录成功获取所有项目的日志

    // 发送成功响应并返回所有项目
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error retrieving projects:', error); // 记录异常的日志
    res.status(500).send('Server error');
  }
});

module.exports = router;
