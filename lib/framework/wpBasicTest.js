var chai = require('chai')
, chaiHttp = require('chai-http');
var paths = require('../utils/Paths');
chai.use(chaiHttp);

var logger = require('./logger').init('wpBasicTest');
var User = require('../models/Schemas/User').User;
var Game = require('../models/Schemas/Game').Game;
var Match = require('../models/Schemas/Match').Match;
var League = require('../models/Schemas/League').League;
var config = require('../config-test');
var mongoose = require('mongoose');
var Constants = require('../utils/Constants');
var wpDate = require('./wpDate');

var app = require("../../app").getApp;

module.exports.clearDB = require('mocha-mongoose')(config.localdb);


module.exports.generateUser = function(name) {
logger.test('generateUser', "Generating a new user " + name);
	 var user = new User();
	 user.name = name;
	 user.password = "testPassword";
	 user.leagues = [];
	 user.email = name + "@email.com";
	 user.activeGames = [];
	 return user;
};

module.exports.generateGame = function(leagueId, clientId) {
logger.test('generateGame', "Generating a new game for league: " + leagueId);
	var game = new Game();
	game.leagueId = leagueId;
  game.users = [clientId];
  game.matchDay = wpDate.dateAdd(Date(), 'week' , Math.floor((Math.random() * 15) + 1));

	return game;
};

module.exports.generateLeague = function(name, userAdmin, frequency, makeTeamsAtNum) {
	logger.test('generateLeague', "Generating a new league " + name + ", making " + userAdmin._id + " the creator");
	var league = new League();
	league.name = name;
	league.users = [userAdmin._id];
	league.admins = [userAdmin._id];
	league.creator = userAdmin._id;
	league.frequency = frequency != null ? frequency : -1;
	league.games = [];
	league.numOfPlayersPerTeam = 5;
	league.makeTeamsAtNum = makeTeamsAtNum != null ? makeTeamsAtNum : 10;

	return league;
};


module.exports.saveUserToDB = function( user , callback) {
    logger.test('saveUserToDB', "saving user to db... ");
    saveObjectToDB(user, callback);
	};

module.exports.saveLeagueToDB = function( league , callback) {
    logger.test('saveLeagueToDB', "saving league to db... ");
    saveObjectToDB(league, callback);
  };

module.exports.saveGameToDB = function( game , callback) {
      logger.test('saveGameToDB', "saving game to db... ");
      saveObjectToDB(game, callback);
  };

	module.exports.getUserById = function(clientId, callback) {
		logger.test('getUserById', 'Getting user from the db..');
		User.findById(clientId, callback);
	}

	module.exports.getGameById = function(gameId, callback) {
		logger.test('getGameById', 'Getting game from the db..');
		Game.findById(gameId, callback);
	}

	module.exports.addUserToGame = function(userId, gameId, callback) {
		logger.test('addUserToGame', 'adding user to game..');
    Game.findByIdAndUpdate(gameId, { $addToSet: {users: [ userId ] } }, {new:true}, callback);
	}

	module.exports.getMatchByGameId = function(gameId, callback) {
		logger.test('getMatchByGameId', 'Getting match from the Match collection.. gameId : ' + gameId);
		Match.findOne({gameId : gameId}, callback);
	}

	module.exports.getLeagueById = function(leagueId, callback) {
		logger.test('getLeagueById', 'Getting league from the League collection.. leagueId : ' + leagueId);
		League.findById(leagueId, callback);
	}


  module.exports.saveUsersToDBBulk = function(array, callback) {
    logger.test('saveUsersToDBBulk', "saving a list of users to db... ");
    logger.test('saveUsersToDBBulk', "Note - bulk updates do not validate... ");
		// Bulk updates can not upload schema objects, we need to make them in to JSON objects
		var arrayOfJSONObjects = [];
		for( var i = 0 ; i  < array.length ; i++) {
			var user = convertUserSchemaToJSON(array[i]);
			arrayOfJSONObjects.push(user);
		}
		User.collection.insert(arrayOfJSONObjects, function(err, result) {
			if(err) {
				throw err;
			}
			logger.test('saveUsersToDBBulk', 'list of users saved to db');
			callback(result.ops);
		})

  };

	module.exports.saveLeaguesToDBBulk = function(array, callback) {
		logger.test('saveLeaguesToDBBulk', "saving a list of leagues to db... ");
		logger.test('saveLeaguesToDBBulk', "Note - bulk updates do not validate... ");
		// Bulk updates can not upload schema objects, we need to make them in to JSON objects
		var arrayOfJSONObjects = [];
		for( var i = 0 ; i  < array.length ; i++) {
			var user = convertLeagueSchemaToJSON(array[i]);
			arrayOfJSONObjects.push(user);
		}
		League.collection.insert(arrayOfJSONObjects, function(err, result) {
			if(err) {
				throw err;
			}
			logger.test('saveLeaguesToDBBulk', 'list of leagues saved to db');
			callback(result.ops);
		})

	};

	module.exports.saveGamesToDBBulk = function(array, callback) {
		logger.test('saveGamesToDBBulk', "saving a list of games to db... ");
		logger.test('saveGamesToDBBulk', "Note - bulk updates do not validate... ");
		// Bulk updates can not upload schema objects, we need to make them in to JSON objects
		var arrayOfJSONObjects = [];
		for( var i = 0 ; i  < array.length ; i++) {
			var game = convertGameSchemaToJSON(array[i]);
			arrayOfJSONObjects.push(game);
		}
		Game.collection.insert(arrayOfJSONObjects, function(err, result) {
			if(err) {
				throw err;
			}
			logger.test('saveGamesToDBBulk', 'list of games saved to db');
			callback(result.ops);
		})

	};


module.exports.sendRequest = function(method, path, headers, body, callback) {
	logger.test('sendRequest', "sending request to WePlay api - " + path);
	switch(method) {
		case Constants.POST:
		sendPostRequest(paths.ROOT + path, headers, body, callback);
		break;
		case Constants.GET:
		sendGetRequest(paths.ROOT + path, headers, callback);
		break;
		case Constants.PUT:
		sendPutRequest(paths.ROOT + path, headers, body, callback);
		break;
	}
};

function sendPostRequest(path, headers, body, callback) {
var requestAgent =	chai.request(app).post(path);

	// iterate over headers
	if(headers != null) {
		for(var key in headers){
					var attrName = key;
					var attrValue = headers[key];
					requestAgent.set(attrName, attrValue);
			 }
	}
	requestAgent.send(body)
	.end(callback);
};

function sendPutRequest(path, headers, body, callback) {
var requestAgent =	chai.request(app).put(path);

	// iterate over headers
	if(headers != null) {
		for(var key in headers){
					var attrName = key;
					var attrValue = headers[key];
					requestAgent.set(attrName, attrValue);
			 }
	}
	requestAgent.send(body)
	.end(callback);
};


function sendGetRequest(path, headers, callback) {
	var requestAgent =	chai.request(app).get(path);

		// iterate over headers
		if(headers != null) {
			for(var key in headers){
						var attrName = key;
						var attrValue = headers[key];
						requestAgent.set(attrName, attrValue);
				 }
		}
		requestAgent.end(callback);
}

// Saves an object to the DB
  function saveObjectToDB( obj , callback) {
      obj.save(function(err , result) {
        if(err) {
          throw err;
        }
        logger.test('saveObjectToDB', 'object saved, id - ' + result.id);
        callback(result);
    });
  };

	function convertLeagueSchemaToJSON(league) {
		return {name: league.name, games : league.games, users: league.users, frequency: league.frequency, admins: league.admins, creator: league.creator};
	}

	function convertUserSchemaToJSON(user) {
		return {name: user.name, leagues : user.leagues, password: user.password, email: user.email};
	}

	function convertGameSchemaToJSON(game) {
		return {leagueId : game.leagueId, matchDay : game.matchDay, users : game.users};
	}
