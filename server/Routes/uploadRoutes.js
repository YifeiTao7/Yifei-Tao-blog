const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const router = express.Router();

// 使用环境变量直接构造credentials对象
const credentials = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),  // 替换转义字符以正确处理多行私钥
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
};

// 初始化 Google Cloud Storage
const storage = new Storage({ credentials });
const bucket = storage.bucket('yifeitaoblogs');

// Multer配置，用于处理内存中的文件上传
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024  // 最大文件大小为5MB
  }
});

router.post('/upload/:type', upload.array('files', 10), (req, res) => {
  if (req.files && req.files.length > 0) {
    const promises = req.files.map(file => {
      const blob = bucket.file(`${req.params.type}/${Date.now()}-${file.originalname}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype
        }
      });

      blobStream.on('error', err => {
        console.log(err);
        return Promise.reject(err);
      });

      blobStream.end(file.buffer);

      return new Promise((resolve, reject) => {
        blobStream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        });
      });
    });

    Promise.all(promises)
      .then(urls => {
        res.status(200).json({ message: 'Files uploaded successfully', fileUrls: urls });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(400).send('No files uploaded');
  }
});

module.exports = router;
