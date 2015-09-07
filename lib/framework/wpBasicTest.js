var request = require('supertest');
var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;

var logger = require('./logger').init('wpBasicTest');
var User = require('../models/User').User;
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

	 return user;
};

module.exports.generateLeague = function(name, userAdmin) {
	logger.test('generateLeague', "Generating a new league " + name + ", making " + userAdmin._id + " the admin");
	var league = new League();
	league.name = name;
	league.users = [userAdmin._id];
	league.admin = userAdmin._id;
	frequency = 0;
	games = null;

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
