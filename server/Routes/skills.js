// routes/skills.js
const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill'); // 确保路径正确

router.get('/', async (req, res) => {
  try {
    console.log("Fetching skills...");
    const skills = await Skill.find();
    console.log("Skills fetched:", skills);
    res.json(skills);
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).json({ message: err.message });
  }
});


// 创建一个新的技能
router.post('/', async (req, res) => {
  const skill = new Skill({
    name: req.body.name,
    icon: req.body.icon,
    category: req.body.category,
    active: req.body.active || false
  });

  try {
    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 获取特定技能
router.get('/:id', getSkill, (req, res) => {
  res.json(res.skill);
});

// 更新技能
router.patch('/:id', getSkill, async (req, res) => {
  if (req.body.name != null) {
    res.skill.name = req.body.name;
  }
  if (req.body.icon != null) {
    res.skill.icon = req.body.icon;
  }
  if (req.body.category != null) {
    res.skill.category = req.body.category;
  }
  if (req.body.active != null) {
    res.skill.active = req.body.active;
  }

  try {
    const updatedSkill = await res.skill.save();
    res.json(updatedSkill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 删除技能
router.delete('/:id', getSkill, async (req, res) => {
  try {
    await res.skill.remove();
    res.json({ message: 'Deleted Skill' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSkill(req, res, next) {
  let skill;
  try {
    skill = await Skill.findById(req.params.id);
    if (skill == null) {
      return res.status(404).json({ message: 'Cannot find skill' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.skill = skill;
  next();
}

module.exports = router;
