
var expect = require('chai').expect;
var Constants = require('../../utils/Constants');
var logger = require('../../utils/logger').init('leagueEndpointTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest');
var LeagueUser = require('../../controllers/userObjects/LeagueUser');

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
		this.timeout(test.defaultTestTimeOut);
		it('addLeague success, User should succesfully add a leagues, and he is the admin', function(done) {
			var userName = 'addLeagueUser';
			var leagueName = 'addLeagueLeague';
			// Generate a user so he can add a leagues
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				var league = test.generateLeague(leagueName, client);
				// Build request
				var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADDLEAGUE;
				var body = { name: league.name, frequency: league.frequency, numOfPlayersPerTeam : league.numOfPlayersPerTeam };
				var headers = {'client-id' : client.id};
				// Send request
				test.sendRequest(Constants.POST, requestPath, headers ,body, function (err, res) {
					expect(err).to.be.null;
					expect(res).to.have.status(200);
					var body = res.body;
					expect(body).to.have.property('success').with.true;
					expect(body).to.have.property('responseText');
					var responseText = body.responseText;

					// This makes sure the client is really the admin of the leagues
					expect(responseText.creator).eql(client.id);
						expect(responseText.admins.indexOf(client.id)).not.eql(-1);

					// Check that the user has the leagues added to his leagues array
					test.getUserById(client.id, function(err, result) {
						expect(err).to.be.null;
						expect(result._id).eql(client._id);
						expect(result.leagues[0]).eql(responseText._id);
						done();
					})
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
		it('addLeague failure, User attempts to add a leagues, but the name is taken', function(done) {
			var userName = 'addLeagueFailure';
			var leagueName = 'addLeagueFailure';
			// Generate a user so he can add a leagues
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				var league = test.generateLeague(leagueName, client);
				test.saveLeagueToDB(league, function(leagueFromDb) {
					// A leagues was saved in the DB, now we try to make another leagues with the same name
					// Build request
					var method = Constants.POST;
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADDLEAGUE;
					var headers = {'client-id' : client.id};
					var body = {name:leagueFromDb.name, users: ['1234'], frequency: leagueFromDb.frequency, games: leagueFromDb.games, numOfPlayersPerTeam : 3};

					// send request
					test.sendRequest(method, requestPath, headers, body, function (err, res) {
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
	 * This tests getting a leagues by name
	 */
	describe('#getLeagueByName()', function() {
		it('Create a leagues, then get that leagues by name', function(done) {
			var userName = 'getLeagueByName';
			var leagueName = 'getLeagueByNameLeague';
			// Generate a user so he can add a leagues
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				var league = test.generateLeague(leagueName, user);
				test.saveLeagueToDB(league, function(leagueFromDb) {

					// Build request
					var method = Constants.GET;
					var headers = {'client-id' : user._id};
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_GETLEAGUEBYNAME + '/' + leagueFromDb.name;

					// Send request
					test.sendRequest(method, requestPath, headers, null, function (err, res) {
						expect(res).to.have.status(200);
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

	describe('#getLeaguesListSearchQuery()', function() {
		it('create many leagues with similiar names, then search for this keyword', function(done) {
			var userName = 'getLeaguesListSearchQuery';
			var leagueName = 'getLeaguesListSearchQuery';
			// Generate a user so he can add a leagues
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {

				// Create 3 leagues
				var leagueA = test.generateLeague(leagueName + 'A', user);
				var leagueB = test.generateLeague(leagueName + 'B', user);
				var leagueC = test.generateLeague('anotherLeague' + 'C', user);
				var leagueList = [leagueA, leagueB, leagueC];
				test.saveLeaguesToDBBulk(leagueList, function(leaguesFromDB) {
					// A leagues was saved in the DB, now we try to get that leagues by id

					// This is the keyword, 2 leagues contain this keyword
					var keyword = 'getLeag';

					// Build request
					var method = Constants.GET;
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_GETLEAGUESBYKEYWORD + '/' + keyword;
					var headers = {'client-id' : user._id};

					//send request
					test.sendRequest(method, requestPath, headers, null, function (err, res) {
						expect(res).to.have.status(200);
						expect(err).to.be.null;
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(Object.keys(responseText.leagues).length).eql(2);
						done();
					});
				});
			});
		});
	});


	/**
	 * This tests getting a leagues by id
	 */
	describe('#getLeagueById()', function() {
		it('Create a leagues, then get that leagues by id', function(done) {
			var userName = 'getLeagueById';
			var leagueName = 'getLeagueByIdLeague';
			// Generate a user so he can add a leagues
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				var league = test.generateLeague(leagueName, user);
				test.saveLeagueToDB(league, function(leagueFromDb) {
					// A leagues was saved in the DB, now we try to get that leagues by id
					// Build request
					var method = Constants.GET;
					var headers = {'client-id' : user._id};
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_GETLEAGUEBYID + '/' + leagueFromDb._id;

					// send request
					test.sendRequest(method, requestPath, headers, null, function (err, res) {
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
	 * This tests getting a leagues by id
	 */
	describe('#addUserToLeagueNotAdmin()', function() {
		it('Create a league, then attempt to add a user to that league, but you are not the admin', function(done) {
			var userName = 'addUserToLeagueNotAdmin';
			var leagueName = 'addUserToLeagueNotAdminLeague';
			// Generate a user so he can add a leagues
			var userAdmin = test.generateUser(userName);
			var userNotAdmin = test.generateUser(userName + '1');
			var userToPush = test.generateUser(userName + '2');
			var usersList = [userAdmin, userNotAdmin, userToPush];
			test.saveUsersToDBBulk(usersList, function(clients){
				// Both users are now added
				var league = test.generateLeague(leagueName, clients[0]);
				test.saveLeagueToDB(league, function(leagueFromDb) {

					// Build request
					var method = Constants.PUT;
					var headers = {'client-id' : clients[1]._id};
					var body = {clientId : clients[2]._id};
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADDUSERTOLEAGUE + '/' + leagueFromDb._id;

					// send request
					test.sendRequest(method, requestPath, headers, body, function (err, res) {
						expect(err).to.be.null;
						var body = res.body;
						expect(body).to.have.property('success').with.false;
						// Now we check that this leagues has not been added to the user's leagues array
						test.getUserById(clients[2]._id, function(err, result) {
							expect(err).to.be.null;
							test.getLeagueById(leagueFromDb.id, function(err, result) {
								expect(err).to.be.null;
								expect(result.users.length).eql(1);
								done();
							})
						});
					});
				});
			});
		});
	});


	/**
	 * This tests getting a leagues by id
	 */
	describe('#addUserToLeague()', function() {
		it('Create a leagues, then push a user to that leagues', function(done) {
			var userName = 'addUserToLeague';
			var leagueName = 'addUserToLeague';
			// Generate a user so he can add a leagues
			var userAdmin = test.generateUser(userName);
			var userToPush = test.generateUser(userName + '1');
			var usersList = [userAdmin, userToPush];
			test.saveUsersToDBBulk(usersList, function(clients){
				// Both users are now added
				var league = test.generateLeague(leagueName, clients[0]);
				test.saveLeagueToDB(league, function(leagueFromDb) {

					// Build request
					var method = Constants.PUT;
					var headers = {'client-id' : clients[1]._id};
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADDUSERTOLEAGUE + '/' + leagueFromDb._id;

					// send request
					test.sendRequest(method, requestPath, headers, null, function (err, res) {
						expect(err).to.be.null;
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.name).to.eql(leagueFromDb.name);
						// Now we check that this leagues has been added to the user's leagues array
						test.getUserById(clients[1]._id, function(err, result) {
							expect(err).to.be.null;
							expect(result._id).eql(clients[1]._id);
							expect(result.leagues[0]).eql(leagueFromDb.id);
							test.getLeagueById(leagueFromDb.id, function(err, result) {
								expect(err).to.be.null;
								expect(result.users.length).eql(2);
								done();
							})
						});
					});
				});
			});
		});
	});

	describe('#addInviteUserToLeague()', function() {
		it('Create a leagues, then push an invite user to that leagues', function(done) {
			var userName = 'addInviteUserToLeague';
			var leagueName = 'addInviteUserToLeagueLeague';
			// Generate a user so he can add a leagues
			var userAdmin = test.generateUser(userName);
			var userToPush = test.generateUser(userName + '1');
			var usersList = [userAdmin, userToPush];
			test.saveUsersToDBBulk(usersList, function(clients){
				// Both users are now added
				var league = test.generateLeague(leagueName, clients[0]);
				test.saveLeagueToDB(league, function(leagueFromDb) {

					// Build request
					var method = Constants.PUT;
					var headers = {'client-id' : clients[0]._id};
					var body = {clientId : clients[1]._id , isInvite : true};
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADDUSERTOLEAGUE + '/' + leagueFromDb._id;

					// send request
					test.sendRequest(method, requestPath, headers, body, function (err, res) {
						expect(err).to.be.null;
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.name).to.eql(leagueFromDb.name);
						// Now we check that this leagues has been added to the user's leagues array
						test.getUserById(clients[1]._id, function(err, result) {
							expect(err).to.be.null;
							expect(result._id).eql(clients[1]._id);
							expect(result.leagues[0]).eql(leagueFromDb.id);
							test.getLeagueById(leagueFromDb.id, function(err, result) {
								expect(err).to.be.null;
								expect(result.users.length).eql(2);
								done();
							})
						});
					});
				});
			});
		});
	});

	describe('#removeInviteUserFromLeague()', function() {
		it('Create a leagues, then push an invite user to that leagues, then remove him', function(done) {
			var userName = 'removeInviteUserToLeague';
			var leagueName = 'removeInviteUserToLeagueLeague';
			// Generate a user so he can add a leagues
			var userAdmin = test.generateUser(userName);
			var userToPush = test.generateUser(userName + '1');
			var usersList = [userAdmin, userToPush];
			test.saveUsersToDBBulk(usersList, function(clients){
				// Both users are now added
				var league = test.generateLeague(leagueName, clients[0]);
				test.saveLeagueToDB(league, function(leagueFromDb) {

					// Build request
					var method = Constants.PUT;
					var headers = {'client-id' : clients[1]._id};
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADDUSERTOLEAGUE + '/' + leagueFromDb._id;

					// send request
					test.sendRequest(method, requestPath, headers, {isInvite : true}, function (err, res) {
						// Now remove this user
						// Build request
						var method = Constants.GET;
						var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_REMOVEUSERFROMLEAGUE_WITH_ID + '/' + leagueFromDb._id;

						test.sendRequest(method, requestPath, headers, null, function(err, result) {
							expect(result).to.have.status(200);
							expect(err).to.be.null;
							var body = result.body;
							expect(body).to.have.property('success').with.true;
							expect(body).to.have.property('responseText');
							var responseText = body.responseText;
							expect(responseText.users.length).eql(1); // No more users
							done();
						});
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
			// Generate a user so he can add a leagues
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {

				// Create 3 leagues
				var leagueA = test.generateLeague(leagueName + 'A', user);
				var leagueB = test.generateLeague(leagueName + 'B', user);
				var leagueC = test.generateLeague(leagueName + 'C', user);
				var leagueList = [leagueA, leagueB, leagueC];
				test.saveLeaguesToDBBulk(leagueList, function(leaguesFromDB) {
					var leagueListIds = [leaguesFromDB[0]._id, leaguesFromDB[1]._id, leaguesFromDB[2]._id];
					// A leagues was saved in the DB, now we try to get that leagues by id

					// Build request
					var method = Constants.POST;
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_GETLEAGUESLIST_BY_ID;
					var headers = {'client-id' : user._id};
					var body = {leagues:leagueListIds};

					//send request
					test.sendRequest(method, requestPath, headers, body, function (err, res) {
						expect(res).to.have.status(200);
						expect(err).to.be.null;
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(Object.keys(responseText.leagues).length).eql(3);
						done();
					});
				});
			});
		});
	});

	describe('#addAdmin()', function() {
		it('Create a leaugue with an admin, then add another user to the leagues and make him admin', function(done) {
			var userName = 'addAdmin';
			var leagueName = 'addAdmin';
			// Generate a user so he can add a leagues
			var user = test.generateUser(userName);
			var anotherUser = test.generateUser(userName + 'Another');
			var usersList = [user, anotherUser];
			test.saveUsersToDBBulk(usersList, function(clients) {
				var league = test.generateLeague(leagueName, clients[0]);
				// Add another user to the leagues
				league.users.push(new LeagueUser(clients[1]._id, "CM", false));

				test.saveLeagueToDB(league, function(leagueFromDB) {

					// Build request
					var method = Constants.PUT;
					var headers = {'client-id' : clients[0]._id};
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADD_ADMIN_WITH_LEAGUE_ID + '/' + leagueFromDB._id;

					// Send request
					test.sendRequest(method, requestPath, headers, {admin : clients[1]._id}, function (err, res) {
						expect(res).to.have.status(200);
						expect(err).to.be.null;
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.admins.length).eql(2);
						done();
					});
				});
			});
		});
	});

	describe('#addAdminFailure()', function() {
		it('Create a leaugue with an admin, then add another user to the leagues and make him admin, but this user is not in the leagues', function(done) {
			var userName = 'addAdminFailure';
			var leagueName = 'addAdminFailure';
			// Generate a user so he can add a leagues
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				var league = test.generateLeague(leagueName, client);
				test.saveLeagueToDB(league, function(leagueFromDB) {

					// Build request
					var method = Constants.PUT;
					var headers = {'client-id' : client._id};
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADD_ADMIN_WITH_LEAGUE_ID + '/' + leagueFromDB._id;

					// Send request
					test.sendRequest(method, requestPath, headers, {admin : "fakeClientId"}, function (err, res) {
						expect(res).to.have.status(200);
						expect(err).to.be.null;
						var body = res.body;
						expect(body).to.have.property('success').with.false;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText).to.be.null;
						done();
					});
				});
			});
		});
	});

	/**
	 * This test updateUser by id happy flow
	 */
	describe('#' + path.PATH_LEAGUES_UPDATELEAGUE, function() {
		it('Create a leagues, then update that leagues Name and admin', function(done) {

			var userName = 'updateLeagueUser';
			var leagueName = 'updateLeague';

			var updatedLeagueName = 'newLeagueName';

			// Generate a user so he can update a leagues
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				var league = test.generateLeague(leagueName, user);

				test.saveLeagueToDB(league, function(leagueFromDb) {
					// A leagues was saved in the DB, now we try to update that leagues by id

					// build request
					var method = Constants.PUT;
					var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_UPDATELEAGUE + '/' + leagueFromDb._id;
					var headers = {'client-id' : user._id};
					var body = { name: updatedLeagueName };

					// send request
					test.sendRequest(method, requestPath, headers, body, function (err, res) {
						expect(err).to.be.null;
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.name).to.eql(updatedLeagueName);
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

	// Build request
	var method = Constants.POST;
	var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADDLEAGUE;
	var headers = {'client-id' : client._id};
	var body = {name:league.name, users: league.users, frequency: league.frequency, games: league.games, numOfPlayersPerTeam : league.numOfPlayersPerTeam};

	test.sendRequest(method, requestPath, headers, body, function (err, res) {
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
