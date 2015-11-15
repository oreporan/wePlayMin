var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
var wpResponse = require('../../framework/wpResponse');
var Constants = require('../../utils/Constants');

//Init the logger
var logger = require('../../utils/logger').init('leaguesEndpoint');
var leagues = require('../../controllers/leagues');

var path = require('../../utils/Paths');
app.use(path.BASE_LEAGUES, router);


//Path : /wePlay/leagues/addLeague Method: POST
router.post(path.PATH_LEAGUES_ADDLEAGUE, addLeague);
function addLeague(req, res) {
	var body = req.body;
	var name = body.name;
	var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	logger.audit('addLeague' , 'adding League: ' + name + ' to Leagues DB');
	leagues.addLeague(name, clientId, body.frequency, body.numOfPlayersPerTeam, body.makeTeamsAtNum, function(err, league) {
		if(err != null) {
			logger.warn('addLeague' , 'could not add League: ' + name + ' to DB, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not add league", err));
			return;
		}
		logger.audit('addLeague' , 'league: ' + name + ' was saved to DB, creator : ' + league.creator);
		res.send(wpResponse.sendResponse(true, league));
		return;
	});
};

router.get(path.PATH_LEAGUES_GETLEAGUESBYKEYWORD + '/:name', getLeaguesListSearchQuery);
function getLeaguesListSearchQuery(req, res) {
	var name = req.params.name;
	logger.audit('getLeaguesListSearchQuery' , 'get League: ' + name);
	leagues.getLeaguesListSearchQuery(name, function(err, leagues) {
		if(err != null) {
			logger.warn('getLeaguesListSearchQuery' , 'could not get League: ' + name + ', reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not get league by name", err));
			return;
		}
		logger.audit('getLeaguesListSearchQuery' , 'returning all leagues with this pattern :  ' + name);
		res.send(wpResponse.sendResponse(true, {'leagues' : leagues}));
		return;
	});
};


//Path : /wePlay/leagues/getLeagueByName/:name Method: GET
router.get(path.PATH_LEAGUES_GETLEAGUEBYNAME + '/:name', getLeagueByName);
function getLeagueByName(req, res) {
	var name = req.params.name;
	logger.audit('getLeagueByName' , 'get League: ' + name);
	leagues.getLeagueByName(name, function(err, league) {
		if(err != null) {
			logger.warn('getLeagueByName' , 'could not get League: ' + name + ', reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not get league by name", err));
			return;
		}
		logger.audit('getLeagueByName' , 'found league with name: ' + name);
		res.send(wpResponse.sendResponse(true, league));
		return;
	});
};

//Path : /wePlay/leagues/getLeagueByName/:name Method: GET
router.put(path.PATH_LEAGUES_ADD_ADMIN_WITH_LEAGUE_ID + '/:leagueId', addAdmin);
function addAdmin(req, res) {
	var leagueId = req.params.leagueId;
	var clientToAdminize = req.body.admin;
	var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	logger.audit('addAdmin' , 'making ' + clientToAdminize + ' an admin');
	leagues.addAdmin(leagueId, clientId, clientToAdminize, function(err, league) {
		if(err != null) {
			logger.warn('addAdmin' , 'could not make: ' + clientToAdminize + ' an admin, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not get make admin", err));
			return;
		}
		logger.audit('addAdmin' , 'made: ' + clientToAdminize + ' an admin');
		res.send(wpResponse.sendResponse(true, league));
		return;
	});
};


//Path : /wePlay/leagues/getLeagueById/:leagueId Method: GET
router.get(path.PATH_LEAGUES_GETLEAGUEBYID + '/:leagueId', getLeagueById);
function getLeagueById(req, res) {
	var leagueId = req.params.leagueId;
	logger.audit('getLeagueById' , 'get LeagueId: ' + leagueId);
	leagues.getLeagueById(leagueId, function(err, league) {
		if(err != null) {
			logger.warn('getLeagueById' , 'could not get LeagueId: ' + leagueId + ', reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not get league by ID", err));
			return;
		}
		res.send(wpResponse.sendResponse(true, league));
		return;
	});
};

//Path : /wePlay/leagues/addUserToLeague Method: POST
router.put(path.PATH_LEAGUES_ADDUSERTOLEAGUE + '/:leagueId/', addUserToLeague);
function addUserToLeague(req, res) {
	var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var leagueId = req.params.leagueId;
	var isInvite = req.body.isInvite ? req.body.isInvite : false;
	var position = req.body.position;
	logger.audit('addUserToLeague' , 'adding clientId: ' + clientId + ' to LeagueId: ' + leagueId);
	leagues.addUserToLeague(clientId, leagueId, isInvite, position, function(err, league) {
		if(err != null || !league) {
			logger.warn('addUserToLeague' , 'could not add user with clientId: ' + clientId + ' to League: ' + leagueId
					+ ' to DB, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not add user to league", err));
			return;
		}
		logger.audit('addUserToLeague' , 'clientId: ' + clientId + ' was added to league: ' + leagueId + ' to DB, creator : ' + league.creator);
		res.send(wpResponse.sendResponse(true, league));
		return;
	});
};

//Path : /wePlay/leagues/removeUserFromLeague'/:leagueId Method: POST
router.get(path.PATH_LEAGUES_REMOVEUSERFROMLEAGUE_WITH_ID + '/:leagueId', removeUserFromLeague);
function removeUserFromLeague(req, res) {
	var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var leagueId = req.params.leagueId;
	logger.audit('removeUserFromLeague' , 'removing clientId: ' + clientId + ' from LeagueId: ' + leagueId);
	leagues.removeUserFromLeague(clientId, leagueId, function(err, league) {
		if(err != null) {
			logger.warn('removeUserFromLeague' , 'could not remove user with clientId: ' + clientId + ' from League: ' + leagueId
					+ ' to DB, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not remove user to league", err));
			return;
		}
		logger.audit('removeUserFromLeague' , 'clientId: ' + clientId + ' was removed from league: ' + leagueId + ' to DB, creator : ' + league.creator);
		res.send(wpResponse.sendResponse(true, league));
		return;
	});
};

//Path : /wePlay/leagues/getAllUserLeagues/:clientId Method: GET
router.post(path.PATH_LEAGUES_GETLEAGUESLIST_BY_ID, getAllUserLeagues);
function getAllUserLeagues(req, res) {
	var listOfLeagues = req.body.leagues;
	var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	leagues.getAllUserLeagues(listOfLeagues, function(err, leagues) {
		if(err != null) {
			logger.warn('getAllUserLeagues' , 'could not get all leagues for clientId: ' + clientId + ', reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not get league by ID", err));
			return;
		}
		logger.audit('getAllUserLeagues' , 'found all leagues for clientId: ' + clientId);
		res.send(wpResponse.sendResponse(true, {'leagues' : leagues}));
		return;
	});
};

//Path : /wePlay/leagues/updateLeague/':leagueId Method: PUT
router.put(path.PATH_LEAGUES_UPDATELEAGUE+ '/:leagueId', updateLeague);
function updateLeague(req, res) {
	var leagueId = req.params.leagueId;
	var params = req.body;
	var paramsAsString = JSON.stringify(params);
	logger.audit('updateLeague' , 'updating League: ' + leagueId + ' with params: ' + paramsAsString + ' to Leagues DB');
	leagues.updateLeague(leagueId, params, function(err, league) {
		if(err != null) {
			logger.warn('updateLeague' , 'could not update League: ' + leagueId + ' with params: ' + paramsAsString + ' to DB, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not add league", err));
			return;
		}
		logger.audit('updateLeague' , 'League: ' + leagueId + ' was updated with params: ' + paramsAsString + ' to DB');
		res.send(wpResponse.sendResponse(true, league));
		return;
	});
};
