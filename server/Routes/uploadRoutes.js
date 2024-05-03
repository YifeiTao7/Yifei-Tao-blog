const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadType = req.params.type; 
    const baseDir = path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'img', uploadType);
    cb(null, baseDir);
  },
  filename: function (req, file, cb) {
    const timestampedFilename = Date.now() + '-' + file.originalname;
    cb(null, timestampedFilename);
  }
});

const upload = multer({ storage: storage });

router.post('/upload/:type', upload.array('files', 10), (req, res) => { 
  if (req.files && req.files.length > 0) {
    const fileUrls = req.files.map(file => {
      const fileUrl = `/assets/img/${req.params.type}/${file.filename}`;
      return fileUrl;
    });
    res.status(200).json({ message: 'Files uploaded successfully', fileUrls: fileUrls });
  } else {
    res.status(400).send('No files uploaded');
  }
});

module.exports = router;
