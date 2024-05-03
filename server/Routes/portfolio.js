const express = require('express');
const router = express.Router();
const Portfolio = require('../models/portfolio');
const Statistic = require('../models/Statistic'); 
const { incrementPublishCount } = require('../utils/statisticHelpers');
const multer = require('multer');
const upload = multer();


router.post('/add', async (req, res) => {
  console.log('Add project endpoint called with body:', req.body);

  try {
    const project = new Portfolio({
      title: req.body.title,
      category: req.body.category,
      imageUrls: req.body.imageUrls,
      description: req.body.description,
      technologies: req.body.technologies, 
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      role: req.body.role,
      githubUrl: req.body.githubUrl,
      liveDemoUrl: req.body.liveDemoUrl
    });


    await project.save();
    await incrementPublishCount();
    res.status(201).json({ message: 'Project added successfully', projectId: project._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});


router.get('/all', async (req, res) => {
  try {
    const projects = await Portfolio.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.get('/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const projects = await Portfolio.find({ title: title });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, {
      $inc: { likes: 1 }
    }, { new: true });

    if (!portfolio) {
      return res.status(404).send('Portfolio not found');
    }
    const totalLikesStat = await Statistic.findOne({ title: "Likes" });
    if (totalLikesStat) {
      totalLikesStat.count += 1;
      await totalLikesStat.save();
    } else {
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
    res.status(500).json({ message: "Error updating likes" });
  }
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProject = await Portfolio.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedProject) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    res.json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Portfolio.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    await incrementPublishCount(-1);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});




module.exports = router;
