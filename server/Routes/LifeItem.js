const express = require('express');
const LifeItem = require('../models/LifeItem');
const router = express.Router();
const { incrementPublishCount } = require('../utils/statisticHelpers');


router.get('/', async (req, res) => {
  try {
    const items = await LifeItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const items = await LifeItem.find({ category: category });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add', async (req, res) => {
  const item = new LifeItem({
    images: req.body.images,
    name: req.body.name,
    quote: req.body.quote,
    category: req.body.category
  });

  try {
    const newItem = await item.save();
    await incrementPublishCount();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/update/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const updatedItem = await LifeItem.findByIdAndUpdate(id, {
      ...req.body,
      images: req.body.images
    }, { new: true });

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedItem = await LifeItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
