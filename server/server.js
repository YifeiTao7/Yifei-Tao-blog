require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const updatePageViews = require('./middlewares/updatePageViews'); 

const statisticsRouter = require('./Routes/statistics');
const userRoutes = require('./Routes/users');
const portfolioRoutes = require('./Routes/portfolio');
const lifeItemsRouter = require('./Routes/LifeItem');
const uploadRoutes = require('./Routes/uploadRoutes');
const messagesRouter = require('./Routes/messages');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(updatePageViews);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    }
});

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
            res.status(500).send({ message: 'Error sending email', error: error });
        } else {
            res.status(200).send({ message: 'Email sent successfully' });
        }
    });
});

app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/life', lifeItemsRouter);
app.use('/api', uploadRoutes);
app.use('/api/statistics', statisticsRouter);
app.use('/api', messagesRouter);

app.use(express.static('client/public'));

app.use((req, res, next) => {
    res.status(404).send('Sorry, that route does not exist.');
});
app.use((err, req, res, next) => {
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
});
