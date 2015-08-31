var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;
var Constants = require('../../utils/Constants');
var logger = require('../../framework/logger').init('leagueEndpointTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest')


chai.use(chaiHttp);
var User = require('../../models/Schemas').User;
var League = require('../../models/Schemas').League;

var app = require("../../../app").getApp;

describe('leagueEndpointTest.js, This test classes tests the leagueEndpoint class', function() {
	var url = 'localhost:3000';

	before(function(done) {
		//clear db after all tests
		test.clearDB(function(err){
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
				var user = test.generateUser(userName);
				test.saveUserToDB(user, function(client) {
					var league = test.generateLeague(leagueName, client);
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

		/**
		* This tests the signup with happy flow, a new user registers and receives a clientId
		*/
			describe('#addLeagueFailure()', function() {
				it('addLeague failure, User attempts to add a league, but the name is taken', function(done) {
					var userName = 'addLeagueFailure';
					var leagueName = 'addLeagueFailure';
					// Generate a user so he can add a league
					var user = test.generateUser(userName);
					test.saveUserToDB(user, function(client) {
						var league = test.generateLeague(leagueName, client);
						test.saveLeagueToDB(league, function(leagueFromDb) {
							// A league was saved in the DB, now we try to make another league with the same name
							chai.request(app)
								.post(path.ROOT + path.BASE_LEAGUES + path.PATH_LEAGUES_ADDLEAGUE)
								.set(Constants.CLIENT_ID_HEADER_KEY, client.id) // Sets the clientID header
								.send({name:league.name, users: league.users, admin: league.admin, frequency: league.frequency, games: league.games})
								.end(function (err, res) {
							expect(err).to.be.null;
							expect(res).to.have.status(200);
							var body = res.body;
							expect(body).to.have.property('success').with.false;
							expect(body).to.have.property('responseText');
							var responseText = body.responseText;
							expect(responseText).to.be.null;

							expect(body).to.have.property('error');
							var error = body.error;
							expect(error).not.to.be.null;
							done();
								});
						});
					});
				});
			});
});
