var request = require('supertest');
var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;

var logger = require('./logger').init('wpBasicTest');
var User = require('../models/Schemas').User;
var League = require('../models/Schemas').League;
var config = require('../config-test');
var mongoose = require('mongoose');


module.exports.clearDB = require('mocha-mongoose')(config.db);


module.exports.generateUser = function(name) {
logger.test('generateUserForTest', "Test, Generating a new user " + name);
	 var user = new User();
	 user.name = "name";
	 user.password = "testPassword";
	 user.leagues = [];
	 user.email = name + "@email.com";
	 user.attending = 0 ;

	 return user;
};

module.exports.generateLeague = function(name, userAdmin) {
	logger.test('generateLeagueForTest', "Test, Generating a new league " + name + ", making " + userAdmin.id + " the admin");
	var league = new League();
	league.name = name;
	league.users = [userAdmin.id];
	league.admin = userAdmin.id;
	frequency = 0;
	games = null;

	return league;
};


module.exports.saveUserToDB = function( user , callback) {
    logger.test('saveUserToDBForTest', "Test, saving user to db... ");
    saveObjectToDB(user, callback);
	};

module.exports.saveLeagueToDB = function( league , callback) {
    logger.test('saveLeagueToDBForTest', "Test, saving league to db... ");
    saveObjectToDB(league, callback);
  };

module.exports.saveGameToDB = function( game , callback) {
      logger.test('saveGameToDBForTest', "Test, saving game to db... ");
      saveObjectToDB(game, callback);
  };

  module.exports.saveUsersToDBBulk = function(list, callback) {
    logger.test('saveUsersToDBBulk', "Test, saving a list of users to db... ");
    logger.warn('saveUsersToDBBulk', "Note - bulk updates do not validate... ");


  }

// Saves an object to the DB
  function saveObjectToDB( obj , callback) {
      obj.save(function(err , result) {
        if(err) {
          throw err;
        }
        logger.test('saveObjectToDBForTest', 'object saved, id - ' + result.id);
        callback(result);
    });
  };
