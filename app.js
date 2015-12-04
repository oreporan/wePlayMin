var express = require('express');
var db = require('./lib/framework/db').connect('weplay_test' , 27017);
var usersExternal = require('./lib/external/main/usersEndpoint.js');
var leaguesExternal = require('./lib/external/main/leaguesEndpoint.js');
var gamesExternal = require('./lib/external/main/gamesEndpoint.js');
var filter = require('./lib/filter');
var authenticate = require('./lib/external/main/authenticate');
var logger = require('./lib/utils/logger.js').init('app');
var bodyParser = require('body-parser');
var Constants = require('./lib/utils/Constants');
var wpresponse = require('./lib/framework/wpResponse');
var path = require('./lib/utils/Paths');
var matches = require('./lib/models/main/matches');
var app = express();
var router = express.Router();

// For client side
app.use(express.static(__dirname + '/public'));

//this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Allow for cross-origin CORS
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

// Routing
app.use(path.ROOT, router); // All requests have wePlay attached
router.use(authenticate);
router.use(filter.doRequest);
router.use(leaguesExternal);
router.use(usersExternal);
router.use(gamesExternal);

var port = process.env.PORT || 3000;
app.listen(port);
logger.audit("listen","Making a smarter planet on port " + port);

module.exports.getApp = app;
