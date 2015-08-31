var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
//This class holds all the methods for Leagues
var League = require('../../models/Schemas').League;
var wpResponse = require('../../framework/wpResponse');

//Init the logger
var logger = require('../../framework/logger').init('leaguesEndpoint');
var leagues = require('../../controllers/leagues');
var path = require('../../utils/Paths');
app.use(path.BASE_LEAGUES, router);

//var LeagueSchema   = new Schema({
//name: {type : String, required : true, unique: true },
//users: [String],
//admin : {type : String, required : true },
//dateCreated: { type: Date, default: Date.now },
//startDate: { type: Date, default: Date.now },
//endDate: {type: Date, default: Date.now},
//frequency : {type: Number, required: true, default : Constants.GAME_FREQUENCY_NEVER},
//games: [GameSchema]

//});

//Path : /wePlay/leagues/addLeague Method: POST
router.post(path.PATH_LEAGUES_ADDLEAGUE, addLeague);
function addLeague(req, res) {
	var name = req.body.name;
	logger.audit('addLeague' , 'adding League: ' + name + ' to Leagues DB');
	// save the league and check for errors
	leagues.addLeague(name, req.body.admin, req.body.frequency, req.body.games, req.body.users, function(league, err) {
		if(err != null) {
			logger.warn('addLeague' , 'could not add League: ' + name + ' to DB, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not add league", err));
			return;
		}
		// League was saved
		logger.audit('addLeague' , 'league: ' + name + ' was saved to DB, admin : ' + league.admin);
		res.send(wpResponse.sendResponse(true, league));
		return;
	});
};

//Path : /wePlay/leagues/getLeagueByName/:name Method: GET
router.get(path.PATH_LEAGUES_GETLEAGUEBYNAME + ':name', getLeagueByName);
function getLeagueByName(req, res) {
	var name = req.params.name;
	logger.audit('getLeagueByName' , 'get League: ' + name);
	leagues.getLeagueByName(name, function(league, err) {
		if(err != null) {
			logger.warn('getLeagueByName' , 'could not get League: ' + name + ', reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not get league by name", err));
			return;
		}
		// League was gotten
		logger.audit('getLeagueByName' , 'found league with name: ' + name);
		res.send(wpResponse.sendResponse(true, league));
		return;
	});
};

//Path : /wePlay/leagues/getLeagueByName/:name Method: GET
router.get(path.PATH_LEAGUES_ADDUSERTOLEAGUE + ':clientId:', addUserToLeague);
function addUserToLeague(req, res) {
	var name = req.params.name;
	logger.audit('getLeagueByName' , 'get League: ' + name);
	leagues.getLeagueByName(name, function(league, err) {
		if(err != null) {
			logger.warn('getLeagueByName' , 'could not get League: ' + name + ', reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not get league by name", err));
			return;
		}
		// League was gotten
		logger.audit('getLeagueByName' , 'found league with name: ' + name);
		res.send(wpResponse.sendResponse(true, league));
		return;
	});
};


