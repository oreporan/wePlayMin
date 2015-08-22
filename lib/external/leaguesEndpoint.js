
var messages = require('../messages').Leagues;
// This class holds all the methods for Leagues
var League = require('../models/Schemas').League;

// Init the logger
var logger = require('../logger').init('leagues');

var users = require('../controllers/users');
var leagues = require('../controllers/leagues');


// var LeagueSchema   = new Schema({
//     name: {type : String, required : true },
//     _id: {type : String, required : true },
//     users: [UserSchema],
//     dateCreated: { type: Date, default: Date.now },
//     startDate: { type: Date, default: Date.now },
//     endDate: {type: Date, default: Date.now},
//     games: [GameSchema]

// });

// Path : /Leagues Method: POST
module.exports.addLeague = function(req, res) {
        logger.audit('addLeague' , 'adding League: ' + req.body.name + ' to Leagues DB');
       
        var League = new League();      // create a new instance of the League model
        League.name = req.body.name;
        League._id = req.body._id;
        League.admin = req.get(Constants.CLIENT_ID);

        // save the league and check for errors
        League.save(function(err) {
        	if(err) {
            		logger.error('addLeague' , 'could not add League: ' + req.body.name + ' to DB, reason : ' + err.stack);
            		res.status(400).send(messages.dbErrorMessage(err.message, err.errors));
        	} 
        	// League was saved
            res.json(messages.dBLeagueSavedMessage());
        });
        
    };

// Path : /Leagues Method: GET
module.exports.getAllLeagues = function(req, res) {
        var clientId = req.get(Constants.CLIENT_ID);
		logger.audit('getAllLeagues' , 'getting all Leagues..');
            leagues.getAllLeagues(function( leagues , err ){
                    if (err)
                res.status(400).send(messages.dbErrorMessage(err.message, err.errors));

            res.json(Leagues);
             });
 };

// Path : /Leagues/:League_name Method: GET
 module.exports.getLeagueByName = function(req, res) {
        League.findOne({name : req.params.League_name}, function(err, League) {
            if (err){
            	 res.status(400).send(messages.dbErrorMessage(err.message, err.errors));
            }
            if(League == null){
            	res.json(messages.dbErrorMessage("No League exists in the Database", "League: " + req.params.League_name + ", does not exist in the database"));
            } else {
            	res.send(League);
            }
        });
 };

// Path : /Leagues/:League_id Method: POST
 module.exports.getLeagueById = function(req, res) {
        League.findById(req.params.League_id, function(err, League) {
            if (err){
            	 res.status(400).send(messages.dbErrorMessage(err.message, err.errors));
            }
            if(League == null){
            	res.json(messages.dbErrorMessage("No League exists in the Database", "League: " + req.params.League_id + ", does not exist in the database"));
            } else {
            	res.send(League);
            }
        });
 };

// Path : /Leagues/:League_id Method: PUT
module.exports.updateLeague = function(req, res) {

        // use our League model to find the League we want
        League.find({name : req.params.League_id}, function(err, League) {

            if (err)
                res.send(err);

            League.name = req.body.name;
        	League.id = req.body.id;
       	 	League.leagues = req.body.leagues;
        	League.attending = req.body.attending;

              // save the bear and check for errors
        	League.save(function(err) {
        		if(err) {
            		console.log(err.stack);
            		res.status(400).send(messages.dbErrorMessage(err.message, err.errors));
        		} 
        	// League was saved
            	res.json(messages.dBLeagueSavedMessage());
        	});
        
    	})

        };

