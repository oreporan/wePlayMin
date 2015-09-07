var chai = require('chai')
var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;
var Constants = require('../../utils/Constants');
var logger = require('../../framework/logger').init('leagueEndpointTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest')
chai.use(chaiHttp);
var app = require("../../../app").getApp;

describe('leagueEndpointTest.js, This test classes tests the leagueEndpoint class', function() {
	before(function(done) {
		//clear db after all tests
		test.clearDB(function(err){
			if (err) return done(err);
			logger.test('clearDB', 'DB cleared for test');
			done();
		});
	});

	/**
	 * This tests the sign-up with happy flow, a new user registers and receives a clientId
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
				.send({ name: league.name, users: league.users, admin: league.admin, frequency: league.frequency, games: league.games})
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
	describe('#Stress test - addLeague()', function() {
		var max = 10;
		it('addLeague stress test, attempt to add 10 Leagues', function(done) {
			var userList = [];
			for(var i = 0 ; i < max ; i++) {
				var userName = 'addLeagueStressTestUser' + i;
				var user = test.generateUser(userName);
				userList.push(user);
			}
			test.saveUsersToDBBulk(userList, function(clients) {
				for(var j = 0 ; j < max ; j++) {
					addLeagueForMultipleTest(clients[j], j, max, done);
				}
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
					.send({name:leagueFromDb.name, users: ['1234'], admin: '1234', frequency: leagueFromDb.frequency, games: leagueFromDb.games})
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

	/**
	 * This tests getting a league by name
	 */
	describe('#getLeagueByName()', function() {
		it('Create a league, then get that league by name', function(done) {
			var userName = 'getLeagueByName';
			var leagueName = 'getLeagueByNameLeague';
			// Generate a user so he can add a league
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				var league = test.generateLeague(leagueName, user);
				test.saveLeagueToDB(league, function(leagueFromDb) {
					// A league was saved in the DB, now we try to get that league by name
					chai.request(app)
					.get(path.ROOT + path.BASE_LEAGUES + path.PATH_LEAGUES_GETLEAGUEBYNAME + '/' + leagueFromDb.name)
					.set(Constants.CLIENT_ID_HEADER_KEY, user._id) // Sets the clientID header
					.end(function (err, res) {
						expect(err).to.be.null;
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.name).to.eql(leagueFromDb.name);
						done();
					});
				});
			});
		});
	});


	/**
	 * This tests getting a league by id
	 */
	describe('#getLeagueById()', function() {
		it('Create a league, then get that league by id', function(done) {
			var userName = 'getLeagueById';
			var leagueName = 'getLeagueByIdLeague';
			// Generate a user so he can add a league
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				var league = test.generateLeague(leagueName, user);
				test.saveLeagueToDB(league, function(leagueFromDb) {
					// A league was saved in the DB, now we try to get that league by id
					chai.request(app)
					.get(path.ROOT + path.BASE_LEAGUES + path.PATH_LEAGUES_GETLEAGUEBYID + '/' + leagueFromDb._id)
					.set(Constants.CLIENT_ID_HEADER_KEY, user._id) // Sets the clientID header
					.end(function (err, res) {
						expect(err).to.be.null;
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.name).to.eql(leagueFromDb.name);
						done();
					});
				});
			});
		});
	});


		/**
		 * This tests getting a league by id
		 */
		describe('#addUserToLeague()', function() {
			it('Create a league, then push a user to that league', function(done) {
				var userName = 'addUserToLeague';
				var leagueName = 'addUserToLeague';
				// Generate a user so he can add a league
				var userAdmin = test.generateUser(userName);
				var userToPush = test.generateUser(userName + '1');
				var usersList = [userAdmin, userToPush];
				test.saveUsersToDBBulk(usersList, function(clients){
					// Both users are now added
					var league = test.generateLeague(leagueName, userAdmin);
					test.saveLeagueToDB(league, function(leagueFromDb) {
						// League was added to DB, now we try to push a new user to the league
						chai.request(app)
						.get(path.ROOT + path.BASE_LEAGUES + path.PATH_LEAGUES_ADDUSERTOLEAGUE + '/' + leagueFromDb._id)
						.set(Constants.CLIENT_ID_HEADER_KEY, userToPush._id) // Sets the clientID header
						.end(function (err, res) {
							expect(err).to.be.null;
							var body = res.body;
							expect(body).to.have.property('success').with.true;
							expect(body).to.have.property('responseText');
							var responseText = body.responseText;
							expect(responseText.name).to.eql(leagueFromDb.name);
							done();
						});
					});
				});
			});
		});

		/**
		 * This tests getting all leagues for a user
		 */
		describe('#getAllUserLeagues()', function() {
			it('create many leagues, make the user part of these leagues, then show the leagues he is in', function(done) {
				var userName = 'getLeagueById';
				var leagueName = 'getLeagueByIdLeague';
				// Generate a user so he can add a league
				var user = test.generateUser(userName);
				test.saveUserToDB(user, function(client) {

					// Create 3 leagues
					var leagueA = test.generateLeague(leagueName + 'A', user);
					var leagueB = test.generateLeague(leagueName + 'B', user);
					var leagueC = test.generateLeague(leagueName + 'C', user);
					var leagueList = [leagueA, leagueB, leagueC];
					test.saveLeaguesToDBBulk(leagueList, function(leaguesFromDB) {
						// A league was saved in the DB, now we try to get that league by id
						chai.request(app)
						.get(path.ROOT + path.BASE_LEAGUES + path.PATH_LEAGUES_GETALLUSERLEAGUES)
						.set(Constants.CLIENT_ID_HEADER_KEY, user._id) // Sets the clientID header
						.end(function (err, res) {
							expect(err).to.be.null;
							var body = res.body;
							expect(body).to.have.property('success').with.true;
							expect(body).to.have.property('responseText');
							var responseText = body.responseText;
							expect(responseText.length).eql(3);
							done();
						});
					});
				});
			});
		});

});

function addLeagueForMultipleTest(client, index, max, done) {
	var leagueName = 'addLeagueLeague';
	var league = test.generateLeague(leagueName + index, client);
	chai.request(app)
	.post(path.ROOT + path.BASE_LEAGUES + path.PATH_LEAGUES_ADDLEAGUE)
	.set(Constants.CLIENT_ID_HEADER_KEY, client._id) // Sets the clientID header
	.send({name:league.name, users: league.users, admin: league.admin, frequency: league.frequency, games: league.games})
	.end(function (err, res) {
		expect(err).to.be.null;
		expect(res).to.have.status(200);
		var body = res.body;
		expect(body).to.have.property('success').with.true;
		expect(body).to.have.property('responseText');

		if(index == max -1) {
			done();
		}
	});
}
