const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');

const authController = require('./lib/authController');

const app = express();
app.use(express.json());

app.post('/login', authController.login);
app.get('/checkToken',authController.checkToken);
app.use(errorHandler());

app.listen(3000, () => {
    console.log('3000번 포트에서 대기 중');
})
