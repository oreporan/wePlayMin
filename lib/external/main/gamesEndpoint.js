var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
var wpResponse = require('../../framework/wpResponse');
var Constants = require('../../utils/Constants');

//Init the logger
var logger = require('../../utils/logger').init('gamesEndpoint');
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
  var matchDay = body.matchDay;
  var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var leagueId = req.get(Constants.LEAGUE_ID_HEADER_KEY);

	logger.audit('addGame' , 'creating a game in league - '+ leagueId +', to be played at:' + matchDay);
	games.addGame(leagueId, matchDay, clientId, function(err, game) {
		if(err != null) {
			logger.warn('addGame' , 'could not create game, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not add game", err));
			return;
		}
		logger.audit('addGame' , 'game: ' + game.id + ' was saved');
		res.send(wpResponse.sendResponse(true, game));
		return;
	});
};


router.get(path.PATH_GAME_JOINGAME_WITH_GAMEID + '/:gameId', joinGame);
function joinGame(req, res) {
  var gameId = req.params.gameId;
  var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var leagueId = req.get(Constants.LEAGUE_ID_HEADER_KEY);

	logger.audit('joinGame' , 'adding user '+ clientId +' to game: ' + gameId);
	games.updateGameAttendingStatus(leagueId, gameId, clientId, Constants.ATTENDING_YES,  function(err, game) {
		if(err != null) {
			logger.warn('joinGame' , 'could not add user to game, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "User not added to game", err));
			return;
		}
		logger.audit('joinGame' , 'success - added user '+ clientId +' to game: ' + gameId);
		res.send(wpResponse.sendResponse(true, game));
		return;
	});
};

router.post(path.PATH_GAME_LEAVEGAME_WITH_GAMEID + '/:gameId', leaveGame);
function leaveGame(req, res) {
  var gameId = req.params.gameId;
  var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var leagueId = req.get(Constants.LEAGUE_ID_HEADER_KEY);

	logger.audit('leaveGame' , 'removing user '+ clientId +' from game: ' + gameId);
	games.updateGameAttendingStatus(leagueId, gameId, clientId, Constants.ATTENDING_NO, function(err, game) {
		if(err != null) {
			logger.warn('leaveGame' , 'could not remove user from game, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "User not removed from game", err));
			return;
		}
		logger.audit('leaveGame' , 'success - removed user '+ clientId +' from game: ' + gameId);
		res.send(wpResponse.sendResponse(true, game));
		return;
	});
};

router.put(path.PATH_GAME_CHANGEGAMESTATUS_WITH_ID + '/:gameId', changeGameStatus);
function changeGameStatus(req, res) {
	var gameId = req.params.gameId;
  var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var leagueId = req.get(Constants.LEAGUE_ID_HEADER_KEY);
	var gameStatus = req.body.shouldCloseGame;

	logger.audit('changeGameStatus' , 'changing game - '+ gameId + ' to status - ' + gameStatus);
	games.changeGameStatus(leagueId, gameId, clientId, gameStatus, function(err, game) {
		if(err != null) {
			logger.error('changeGameStatus' , 'could not change game status, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not change game status", err));
			return;
		}
		logger.audit('changeGameStatus' , 'game: ' + gameId +' changed to: ' + gameStatus);
		res.send(wpResponse.sendResponse(true, game));
		return;
	});
};

router.get(path.PATH_GAME_GETGAME_WITH_ID + '/:gameId', getGameById);
function getGameById(req, res) {
  var gameId = req.params.gameId;
	logger.audit('getGameById' , ' getting game: ' + gameId);
	games.getGameById(gameId, function(err, game) {
		if(err != null) {
			logger.warn('getGameById' , 'could not get game, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "could not get game", err));
			return;
		}
		logger.audit('getGameById' , 'success, retrieved game: ' + gameId);
		res.send(wpResponse.sendResponse(true, game));
		return;
	});
};


router.post(path.PATH_GAME_GETGAMELIST, getGamesListById);
function getGamesListById(req, res) {
  var gameArray = req.body.games;
	logger.audit('getGamesListById' , ' getting games list');
	games.getGamesListById(gameArray, function(err, listOfGames) {
		if(err != null || listOfGames < 1) {
			logger.warn('getGamesListById' , 'could not get games, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "could not get games", err));
			return;
		}
		logger.audit('getGamesListById' , 'success, retrieved games objects list');
		res.send(wpResponse.sendResponse(true, listOfGames));
		return;
	});
};


router.put(path.PATH_GAME_UPDATEGAME + '/:gameId', updateGame);
function updateGame(req, res) {
	var gameId = req.params.gameId;
  var params = req.body;
	logger.audit('updateGame' , ' updating game: ' + gameId);
	games.updateGame(gameId, params, function(err, updatedGame) {
		if(err != null) {
			logger.warn('updateGame' , 'could not update game, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "could not get games", err));
			return;
		}
		logger.audit('updateGame' , 'success, updated game: ' + gameId);
		res.send(wpResponse.sendResponse(true, updatedGame));
		return;
	});
};
