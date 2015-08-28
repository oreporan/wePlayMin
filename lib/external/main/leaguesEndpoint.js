var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
app.use("/leagues", router);

// This class holds all the methods for Leagues
var League = require('../../models/Schemas').League;
var wpResponse = require('../../framework/wpResponse');

// Init the logger
var logger = require('../../framework/logger').init('leaguesEndpoint');
var leagues = require('../../controllers/leagues');


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
router.post('/addLeague', addLeague);
function addLeague(req, res) {
        logger.audit('addLeague' , 'adding League: ' + req.body.name + ' to Leagues DB');
        // save the league and check for errors
        leagues.addLeague(req.body.name, req.body.admin, req.body.frequency, req.body.games, req.body.users, function(league, err) {
        	if(err != null) {
            		logger.warn('addLeague' , 'could not add League: ' + req.body.name + ' to DB, reason : ' + err);
            		res.send(wpResponse.sendResponse(null, "Could not add league", err, false));
                return;
        	}
        	// League was saved
          logger.audit('addLeague' , 'league: ' + req.body.name + ' was saved to DB, admin : ' + league.admin);
          res.send(wpResponse.sendResponse(league, null, null, true));
          return;
        });
    };
