var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;

var logger = require('./logger').init('wpBasicTest');
var User = require('../models/User').User;
var Game = require('../models/Game').Game;
var League = require('../models/League').League;
var config = require('../config-test');
var mongoose = require('mongoose');


module.exports.clearDB = require('mocha-mongoose')(config.localdb);


module.exports.generateUser = function(name) {
logger.test('generateUser', "Generating a new user " + name);
	 var user = new User();
	 user.name = name;
	 user.password = "testPassword";
	 user.leagues = [];
	 user.email = name + "@email.com";
	 user.attending = 0 ;
	 user.activeGames = [];
	 return user;
};

module.exports.generateGame = function(leagueId, clientId) {
logger.test('generateGame', "Generating a new game for league: " + leagueId);
	var game = new Game();
	game.leagueId = leagueId;
  game.users = [clientId];
  game.matchDay = new Date(Math.floor((Math.random() * 1000) + 1),
Math.floor((Math.random() * 12) + 1),
Math.floor((Math.random() * 30) + 1));

	return game;
};

module.exports.generateLeague = function(name, userAdmin) {
	logger.test('generateLeague', "Generating a new league " + name + ", making " + userAdmin._id + " the admin");
	var league = new League();
	league.name = name;
	league.users = [userAdmin._id];
	league.admin = userAdmin._id;
	league.frequency = 0;
	league.games = [];
	league.numOfPlayersPerTeam = 5;

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
		return {name: league.name, games : league.games, users: league.users, frequency: league.frequency, admin: league.admin};
	}

	function convertUserSchemaToJSON(user) {
		return {name: user.name, leagues : user.leagues, password: user.password, email: user.email, attending: user.attending};
	}

	function convertGameSchemaToJSON(game) {
		return {leagueId : game.leagueId, matchDay : game.matchDay, users : game.users};
	}
