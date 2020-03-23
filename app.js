// app.js

var express = require('express');
var bodyParser = require('body-parser');

var product = require('./routes/product'); // Imports routes for the products
var app = express();


// Set up mongoose connection
var mongoose = require('mongoose');
// var dev_db_url = 'mongodb://<user>:<pwd>@mongodbhost.com:27017/cruudproductapp';
var dev_db_url = 'mongodb://localhost:27017/crudproductapp';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/products', product);

var port = process.env.SERVER_PORT || 3333;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
