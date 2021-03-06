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

//Path : /wePlay/game/addGame Method: POST
router.post(path.PATH_GAME_ADDGAME, addGame);
function addGame(req, res) {
	var body = req.body;
  var matchDay = body.matchDay;
  var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var leagueId = req.get(Constants.LEAGUE_ID_HEADER_KEY);

	logger.audit('addGame' , 'creating a game in leagues - '+ leagueId +', to be played at:' + matchDay);
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

router.get(path.PATH_GAME_ATTENDINGSTATUS_WITH_GAMEID + '/:gameId/:attending', toggleAttending);
function toggleAttending(req, res) {
  var gameId = req.params.gameId;
  var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var leagueId = req.get(Constants.LEAGUE_ID_HEADER_KEY);
	var attending = parseInt(req.params.attending);
	logger.audit('toggleAttending' , ' user '+ clientId +' , game: ' + gameId + ' has toggled attending to :' + attending );
	games.updateGameAttendingStatus(leagueId, gameId, clientId, attending,  function(err, game) {
		if(err != null) {
			logger.warn('toggleAttending' , 'could not toggle user attending status to game, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "User status could not be toggled", err));
			return;
		}
		logger.audit('toggleAttending' ,' success - user '+ clientId +' , game: ' + gameId + ' has toggled attending to :' + attending);
		// We want to return only the gameUser that toggled the attending
		var gameUsers = game.users;
		var gameUser;
		for(var i = 0 ; i < gameUsers.length ; i++) {
			if(gameUsers[i]._id === clientId) {
				gameUser = gameUsers[i];
			}
		}
		res.send(wpResponse.sendResponse(true, gameUser));
		return;
	});
};

router.put(path.PATH_GAME_BUILD_TEAMS_WITH_ID + '/:gameId', buildTeams);
function buildTeams(req, res) {
  var gameId = req.params.gameId;
  var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var leagueId = req.get(Constants.LEAGUE_ID_HEADER_KEY);
	var teamsArray = req.body.teams;
	logger.debug('buildTeams' , ' building teams for game: ' + gameId );
	games.buildTeams(gameId, clientId, leagueId, teamsArray, function(err, game) {
		if(err != null) {
			logger.warn('buildTeams' , 'could not build teams, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "could not build teams", err));
			return;
		}
		logger.debug('buildTeams' ,' success - teams for game : ' + gameId + ' has been built');
		res.send(wpResponse.sendResponse(true, game));
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
	if(gameArray == null) {
		logger.warn('getGamesListById' , 'could not get games, reason : missing required parameter');
	}

	logger.audit('getGamesListById' , ' getting games list');
	games.getGamesListById(gameArray, function(err, listOfGames) {
		if(err != null || listOfGames.length < 1) {
			logger.warn('getGamesListById' , 'could not get games, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "could not get games", err));
			return;
		}
		logger.audit('getGamesListById' , 'success, retrieved games objects list');
		res.send(wpResponse.sendResponse(true, {'games' : listOfGames}));
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
