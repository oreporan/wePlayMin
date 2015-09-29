var express = require('express');
var db = require('./lib/framework/db').connect('weplay_test' , 27017);
var usersExternal = require('./lib/external/main/usersEndpoint.js');
var leaguesExternal = require('./lib/external/main/leaguesEndpoint.js');
var gamesExternal = require('./lib/external/main/gamesEndpoint.js');
var app = express();
var filter = require('./lib/filter');
var authenticate = require('./lib/external/main/authenticate');
var logger = require('./lib/framework/logger.js');
var bodyParser = require('body-parser');
var Constants = require('./lib/utils/Constants');
var wpresponse = require('./lib/framework/wpResponse');
var path = require('./lib/utils/Paths');
var router = express.Router();

var port = process.env.PORT || 3000;

// Since server has just started - we create a new logger file
//logger.initFile();
logger = logger.init('server');


//configure app to use bodyParser()
//this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow for cross-origin CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(path.ROOT, router); // All requests have wePlay attached
router.use(authenticate);

//middleware to use for all requests
router.use(filter.validateRequest);

router.use(leaguesExternal);
router.use(usersExternal);
router.use(gamesExternal);


app.listen(port);
logger.audit("listen","Making a smarter planet on port " + port);

module.exports.getApp = app;
