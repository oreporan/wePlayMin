var express = require('express');
var db = require('./db').connect();
var usersExternal = require('./external/usersEndpoint.js');
var users = require('./controllers/users.js');
var app = express(); 
var filter = require('./filter');
var logger = require('./framework/logger.js');
var bodyParser = require('body-parser');
var Constants = require('./utils/Constants');

// Since server has just started - we create a new logger file
logger.initFile();
logger = logger.init('server');

//app.use('/wePlay', filter.router); // All requests have wePlay attached

//configure app to use bodyParser()
//this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(usersExternal);
app.use(filter);

app.listen(3000);
console.log("Listening on port 3000");