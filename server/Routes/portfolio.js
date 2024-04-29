const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio'); // 确保路径正确

// 添加新项目的路由处理器
router.post('/add', async (req, res) => {
  console.log('Add project endpoint called with body:', req.body); // 记录请求体内容

  try {
    // 创建新项目对象，包含所有必要的字段
    const project = new Portfolio({
      title: req.body.title,
      category: req.body.category,
      imageUrls: req.body.imageUrls, // 注意这是一个数组
      description: req.body.description,
      technologies: req.body.technologies, // 这也可能是一个数组
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      role: req.body.role,
      githubUrl: req.body.githubUrl,
      liveDemoUrl: req.body.liveDemoUrl
    });

    // 保存项目到数据库
    await project.save();
    console.log('Project added successfully:', project); // 记录成功添加项目的日志

    // 发送成功响应
    res.status(201).json({ message: 'Project added successfully', projectId: project._id });
  } catch (error) {
    console.error('Error adding project:', error); // 记录异常的日志
    res.status(500).json({ error: 'Server error', details: error.message });
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

router.get('/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const projects = await Portfolio.find({ title: title }); // 根据类别查询
    console.log('Retrieved projects by title:', projects); // 记录查询结果
    res.json(projects); // 返回符合该类别的所有数据
  } catch (err) {
    console.error('Error retrieving projects by title:', err); // 记录错误信息
    res.status(500).json({ message: err.message }); // 返回错误状态和消息
  }
});

module.exports = router;
