const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const notificationRouter = require('./routes/notifications')
const feedRouter = require('./routes/feeds')
const fodderRouter = require('./routes/fodders')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/notifications', notificationRouter)
app.use('/api/feeds', feedRouter)
app.use('/api/fodders', fodderRouter)

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log("Connection successfully")
});

module.exports = app;
