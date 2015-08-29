var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../../config-test');
var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;
var Constants = require('../../utils/Constants');
var logger = require('../../framework/logger').init('leagueEndpointTest');
var path = require('../../utils/Paths');

chai.use(chaiHttp);
var User = require('../../models/Schemas').User;
var League = require('../../models/Schemas').League;

var app = require("../../../app").getApp;

describe('leagueEndpointTest.js, This test classes tests the leagueEndpoint class', function() {
	var url = 'localhost:3000';

	before(function(done) {
		//clear db after all tests
		var clearDB = require('mocha-mongoose')(config.db);
		clearDB(function(err){
			if (err) return done(err);
			done();
	  });
	});

	/**
	* This tests the signup with happy flow, a new user registers and receives a clientId
	*/
		describe('#addLeague()', function() {
			it('addLeague success, User should succesfully add a league, and he is the admin', function(done) {
				var userName = 'addLeagueUser';
				var leagueName = 'addLeagueLeague';
				// Generate a user so he can add a league
				var user = generateUserForTest(userName);
				saveUserToDBForTest(user, function(client) {
					var league = generateLeagueForTest(leagueName, client);
					chai.request(app)
					.post(path.ROOT + path.BASE_LEAGUES + path.PATH_LEAGUES_ADDLEAGUE)
					.set(Constants.CLIENT_ID_HEADER_KEY, client.id) // Sets the clientID header
					.send({name:league.name, users: league.users, admin: league.admin, frequency: league.frequency, games: league.games})
					.end(function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;

						// This makes sure the client is really the admin of the league
						expect(responseText.admin).eql(client.id);
						done();
					});
				});
			});
		});
});

function generateUserForTest(name) {
logger.debug('generateUserForTest', "Test, Generating a new user " + name);

	// create a new instance of the User model and save it in DB
	 var user = new User();
	 user.name = "name";
	 user.password = "testPassword";
	 user.leagues = [];
	 user.email = name + "@email.com";
	 user.attending = 0 ;

	 return user;
};

function generateLeagueForTest(name, userAdmin) {
	logger.debug('generateLeagueForTest', "Test, Generating a new league " + name + ", making " + userAdmin.id + " the admin");
	var league = new League();
	league.name = name;
	league.users = [userAdmin.id];
	league.admin = userAdmin.id;
	frequency = 0;
	games = null;

	return league;
};

	function saveUserToDBForTest( user , callback) {
			user.save(function(err , client) {
			logger.debug('saveUserToDBForTest', "Test, Saved user to db - " + client.id);
				if(err) {
					throw err;
				}
				callback(client);
		});
	};
