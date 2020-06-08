const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');

const dbFactory = require('./DIlib/db');
const authServiceFactory = require('./DIlib/authService');
const authControllerFactory = require('./DIlib/authController');

const app = express();
app.use(express.json());

const db = dbFactory('example-db');
const authService = authServiceFactory(db,'오늘저녁넙췽');
const authController = authControllerFactory(authService);

require('authsrv-plugin-logout')(app, authService, db);


app.post('/login', authController.login);
app.get('/checkToken',authController.checkToken);
app.use(errorHandler());

app.listen(3000, () => {
    console.log('3000번 포트에서 대기 중');
})
