// app.js

var express = require('express');
var bodyParser = require('body-parser');
const createError = require("http-errors");

var product = require('./routes/product.route'); // Imports routes for the products
var app = express();

// logger
const logger = require('./conf/logger');

// Set up mongoose connection
var mongoose = require('mongoose');
// var dev_db_url = 'mongodb://<user>:<pwd>@mongodbhost.com:27017/cruudproductapp';
var dev_db_url = 'mongodb://localhost:27017/crudproductapp';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', logger.error.bind(logger, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/products', product);


app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;

    // render the error page
    res.status(err.status || 500);
    res.send(err);
});

var port = process.env.SERVER_PORT || 3333;

var server = app.listen(port, () => {
    logger.info('Server is up and running on port number ' + port);
});

module.exports = server;