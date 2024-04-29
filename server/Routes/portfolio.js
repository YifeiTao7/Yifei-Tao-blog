const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio'); // 确保路径正确
const Statistic = require('../models/Statistic'); 
const { incrementPublishCount } = require('../utils/statisticHelpers');

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
    await incrementPublishCount();

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

router.post('/:id/like', async (req, res) => {
  try {
    // Increment likes for the specified project
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, {
      $inc: { likes: 1 }
    }, { new: true });

    if (!portfolio) {
      return res.status(404).send('Portfolio not found');
    }

    // Update the total likes statistic
    const totalLikesStat = await Statistic.findOne({ title: "Likes" });
    if (totalLikesStat) {
      totalLikesStat.count += 1; // Increment the count
      await totalLikesStat.save();
    } else {
      // If no statistic found, possibly create a new one
      const newStat = new Statistic({
        title: "Likes",
        count: 1,
        description: "Total number of likes on projects",
        icon: "bi-hand-thumbs-up"
      });
      await newStat.save();
    }

    res.json({ portfolio: portfolio, totalLikes: totalLikesStat ? totalLikesStat.count : 1 });
  } catch (error) {
    console.error('Error updating likes:', error);
    res.status(500).json({ message: "Error updating likes" });
  }
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // 查找并更新项目，返回更新后的文档
    const updatedProject = await Portfolio.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedProject) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: "Validation Error", details: error.message });
    } else {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
});




module.exports = router;
