require('dotenv').config(); // 加载.env文件中的环境变量
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const updatePageViews = require('./middlewares/updatePageViews'); 

// 导入路由
const statisticsRouter = require('./Routes/statistics');
const userRoutes = require('./Routes/users');
const portfolioRoutes = require('./Routes/portfolio');
const lifeItemsRouter = require('./Routes/LifeItem');
const uploadRoutes = require('./Routes/uploadRoutes');
const messagesRouter = require('./Routes/messages');

const app = express();

// MongoDB 连接
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析 JSON 格式的请求体
app.use(updatePageViews);

// 邮件发送设置
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    }
});

// 发送邮件的路由
app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;
    const mailOptions = {
        from: email,
        to: process.env.TARGET_EMAIL,
        subject: subject,
        text: `You received a message from ${name} (${email}): ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send({ message: 'Error sending email', error: error });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send({ message: 'Email sent successfully' });
        }
    });
});

// 应用路由
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/life', lifeItemsRouter);
app.use('/api', uploadRoutes);
app.use('/api/statistics', statisticsRouter);
app.use('/api', messagesRouter);

// 静态文件服务
app.use(express.static('client/public'));

// 错误处理
app.use((req, res, next) => {
    res.status(404).send('Sorry, that route does not exist.');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 服务器端口监听
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
