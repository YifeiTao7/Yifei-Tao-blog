const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// 定义存储的路径
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadType = req.params.type; // 'life' 或 'portfolio'
    console.log(`Upload type: ${uploadType}`); // 打印上传类型
    // 根据类型动态设置路径
    const baseDir = path.join(__dirname, '..', '..', 'client', 'public', 'assets', 'img', uploadType);
    console.log(`Destination path: ${baseDir}`); // 打印文件保存路径
    cb(null, baseDir);
  },
  filename: function (req, file, cb) {
    const timestampedFilename = Date.now() + '-' + file.originalname;
    console.log(`Generated filename: ${timestampedFilename}`); // 打印生成的文件名
    cb(null, timestampedFilename); // 使用时间戳来避免文件名冲突
  }
});

const upload = multer({ storage: storage });

// 修改为接受多个文件的上传
router.post('/upload/:type', upload.array('files', 10), (req, res) => { // 假设最多可以上传10个文件
  console.log(`Received ${req.files.length} files`); // 打印接收到的文件数量
  if (req.files && req.files.length > 0) {
    // 使用 map 来生成所有上传文件的 URL 列表
    const fileUrls = req.files.map(file => {
      const fileUrl = `/assets/img/${req.params.type}/${file.filename}`;
      console.log(`File URL: ${fileUrl}`); // 打印每个文件的URL
      return fileUrl;
    });
    res.status(200).json({ message: 'Files uploaded successfully', fileUrls: fileUrls });
  } else {
    console.log('No files uploaded'); // 如果没有文件上传，打印此消息
    res.status(400).send('No files uploaded');
  }
});

module.exports = router;
