var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
var wpResponse = require('../../framework/wpResponse');
var Constants = require('../../utils/Constants');

//Init the logger
var logger = require('../../framework/logger').init('gamesEndpoint');
var leagues = require('../../controllers/leagues');
var games = require('../../controllers/games');

var path = require('../../utils/Paths');
app.use(path.BASE_GAME, router);



// var GameSchema   = new Schema({
//     leagueId : {type : String, required: true},
//     users : [String],
//     numOfPlayersPerTeam : Number,
//     matchDay : {type : Date, required : true},
//     dateCreated: { type: Date, default: Date.now },
//     teamA : [String],
//     teamB : [String],
//     invites : [String]
// });

//Path : /wePlay/game/addGame Method: POST
router.post(path.PATH_GAME_ADDGAME, addGame);
function addGame(req, res) {
	var body = req.body;
	var leagueId = body.leagueId;
  var numOfPlayersPerTeam = body.numOfPlayersPerTeam;
  var matchDay = body.matchDay;
  var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);

	logger.audit('addGame' , 'creating a game in league - '+ leagueId +', to be played at:' + matchDay);
	games.addGame(leagueId, numOfPlayersPerTeam, matchDay, clientId, function(err, game) {
		if(err != null) {
			logger.warn('addGame' , 'could not create game, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not add game", err));
			return;
		}
		logger.audit('addGame' , 'game: ' + game.id + ' was saved to DB');
		res.send(wpResponse.sendResponse(true, game));
		return;
	});
};


router.post(path.PATH_GAME_ADDUSERTOGAME_WITH_GAMEID + '/:gameId', addUserToGame);
function addUserToGame(req, res) {
  var gameId = req.params.gameId;
  var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	logger.audit('addUserToGame' , 'adding user '+ clientId +' to game: ' + gameId);
	games.addUserToGame(gameId, clientId, function(err, game) {
		if(err != null) {
			logger.warn('addUserToGame' , 'could not add user to game, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "User not added to game", err));
			return;
		}
		logger.audit('addUserToGame' , 'success - added user '+ clientId +' to game: ' + gameId);
		res.send(wpResponse.sendResponse(true, game));
		return;
	});
};

router.post(path.PATH_GAME_REMOVEUSERFROMGAME_WITH_GAMEID + '/:gameId', removeUserFromGame);
function removeUserFromGame(req, res) {
  var gameId = req.params.gameId;
  var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	logger.audit('removeUserFromGame' , 'removing user '+ clientId +' from game: ' + gameId);
	games.removeUserFromGame(gameId, clientId, function(err, game) {
		if(err != null) {
			logger.warn('removeUserFromGame' , 'could not remove user from game, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "User not removed from game", err));
			return;
		}
		logger.audit('removeUserFromGame' , 'success - removed user '+ clientId +' from game: ' + gameId);
		res.send(wpResponse.sendResponse(true, game));
		return;
	});
};
