
var expect = require('chai').expect;
var logger = require('../../utils/logger').init('gamesEndpointTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest');
var Constants = require('../../utils/Constants');
var LeagueUser = require('../../controllers/userObjects/LeagueUser');

describe('gamesEndpoint.js, This test class tests the games endpoint', function() {
	this.timeout(10 * 1000);
	before(function(done) {

			//clear db after all tests
		test.clearDB(function(err){
			if (err) return done(err);
			logger.test('clearDB', 'DB cleared for test');
			done();
		});
	});

	/**
	 * This tests creating a game
	 */
	describe('#addGame()', function() {
		it('Create a user, a leagues, and a game in this leagues, expect to get the updated leagues back ', function(done) {
      var userName = 'addGame';
      var leagueName = 'addGameLeague';
      var user = test.generateUser(userName);
      test.saveUserToDB(user, function(client) {
        var league = test.generateLeague(leagueName, client);
        test.saveLeagueToDB(league, function(league){
					var headers = {'client-id' : client._id, 'league-id' : league._id};
					test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, headers, {matchDay : Date(), users: client.id }, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.users.length).eql(1);
						var gameUser = responseText.users[0];
						expect(gameUser.attending).eql(1);
						done();
					});
        })
		});
	});
});

/**
 * This tests creating a game but the creator is not the admin
 */
describe('#addGameFailure()', function() {
  it('Create a user, a leagues, and attempt to create a game, but you are not the admin! ', function(done) {
    var userName = 'addGameFailure';
    var leagueName = 'addGameFailureLeague';
    var user = test.generateUser(userName);
    var userB = test.generateUser(userName + 'B');
    var listOfUsers = [user, userB];
    test.saveUsersToDBBulk(listOfUsers, function(clients) {
      var league = test.generateLeague(leagueName, clients[0]);
      test.saveLeagueToDB(league, function(league){
				var headers = {'client-id' : clients[1]._id, 'league-id' : league._id};
				test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, headers, {matchDay : Date(), users: clients[1]._id }, function (err, res) {
					expect(err).to.be.null;
          expect(res).to.have.status(200);
          var body = res.body;
          expect(body).to.have.property('success').with.false;
          expect(body).to.have.property('responseText');
          var responseText = body.responseText;
          expect(responseText).to.be.null;
          var error = body.error;
          expect(error).to.be.not.null;
          done();
				});
      })
  });
});
});

/**
 * This tests creating a game but the creator is not the admin
 */
describe('#getGamesListById()', function() {
	var numOfGames = 4;
  it('Creates several games and attempts to get them! ', function(done) {
    var userName = 'getGamesListById';
    var leagueName = 'getGamesListByIdLeague';
    var user = test.generateUser(userName);
    test.saveUserToDB(user, function(client) {
      var league = test.generateLeague(leagueName, client);
      test.saveLeagueToDB(league, function(league){
				// generate 3 games
				var gamesArray = [];
				for(var i = 0 ; i < numOfGames ; i++) {
					gamesArray.push(test.generateGame(league._id, client));
				}

				// save games to DB
				test.saveGamesToDBBulk(gamesArray, function(listOfGames) {
					var headers = {'client-id' : client._id, 'league-id' : league._id};
					test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_GETGAMELIST, headers, {games: listOfGames}, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						var games = responseText.games;
						expect(games.length).eql(numOfGames);
						done();
					});
				})
      })
  });
});
});



/**
 * This tests adding a user to a game
 */
describe('#joinGame()', function() {
  it('Add a new user to an existing game ', function(done) {
    var userName = 'addUserToGame';
    var leagueName = 'addUserToGameLeague';
    var userA = test.generateUser(userName);
    var userB = test.generateUser(userName + "B");
    var listOfUsers = [userA, userB];
    test.saveUsersToDBBulk(listOfUsers, function(clients) {
      var league = test.generateLeague(leagueName, clients[0]);
			// Push another player to the leagues
			league.users.push(new LeagueUser(clients[1]._id.toString(), "CM", false));
      test.saveLeagueToDB(league, function(league){
				var headers = {'client-id' : clients[0]._id, 'league-id' : league._id};
				test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, headers, {matchDay : Date(), users: clients[0]._id }, function (err, res) {
					// Game created, now we add a new user to this game
					var responseText = res.body.responseText;
					var gameId = responseText._id;
					 headers = {'client-id' : clients[1]._id, 'league-id' : league._id};

					test.sendRequest(Constants.GET, path.BASE_GAME + path.PATH_GAME_ATTENDINGSTATUS_WITH_GAMEID + '/' + gameId + '/1', headers , null, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.attending).eql(1);
						// Now we check that the user has another game added to his activeGames
						test.getUserById(clients[1]._id, function(err, result) {
							expect(err).to.be.null;
							expect(result._id).eql(clients[1]._id);
							expect(result.activeGames[0]).eql(gameId);
							done();
						});
				});
				});
  });
});
});
});

describe('#joinLeagueAndGame()', function() {
  it('Create a leagues, create a game, then add a new user to that leagues, expect him to be in the game ', function(done) {
    var userName = 'joinLeagueAndGame';
    var leagueName = 'joinLeagueAndGameLeague';
    var userA = test.generateUser(userName);
    var userB = test.generateUser(userName + "B");
    var listOfUsers = [userA, userB];
    test.saveUsersToDBBulk(listOfUsers, function(clients) {
      var league = test.generateLeague(leagueName, clients[0]);
			// Push another player to the leagues
      test.saveLeagueToDB(league, function(league){
				var headers = {'client-id' : clients[0]._id, 'league-id' : league._id};
				test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, headers, {matchDay : Date(), users: clients[0]._id }, function (err, gameResA) {
					test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, headers, {matchDay : Date(), users: clients[0]._id }, function (err, gameResB) {
						// Create ANOTHER game, just to make sure the user is added to all the games
						// Game created, now we add a new user to this leagues
						var method = Constants.PUT;
						var headers = {'client-id' : clients[1]._id};
						var body = {position : "LM", clientId : clients[1]._id};
						var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADDUSERTOLEAGUE + '/' + league._id;

						test.sendRequest(method, requestPath, headers, body, function (err, res) {
							expect(err).to.be.null;
							expect(res).to.have.status(200);
							var body = res.body;
							expect(body).to.have.property('success').with.true;
							expect(body).to.have.property('responseText');
							var responseText = body.responseText;
							expect(responseText.users.length).eql(2);
							// Now we check that the user has another game added to his activeGames
							var gameResponse = gameResA.body.responseText;
							test.getGameById(gameResponse._id, function(err, result) {
								expect(err).to.be.null;
								expect(result.users.length).eql(2);
							});
							var gameResponseB = gameResB.body.responseText;
							test.getGameById(gameResponseB._id, function(err, result) {
								expect(err).to.be.null;
								expect(result.users.length).eql(2);
								done();
							});
					});
					});
				});
  });
});
});
});

/**
 * This tests adding a user to a game
 */
describe('#leaveGame()', function() {
  it('remove a  user from an existing game ', function(done) {
    var userName = 'leaveGame';
    var leagueName = 'leaveGameLeague';
    var userA = test.generateUser(userName);
    var userB = test.generateUser(userName + "B");
    var listOfUsers = [userA, userB];
    test.saveUsersToDBBulk(listOfUsers, function(clients) {
      var league = test.generateLeague(leagueName, clients[0]);
			// Push another player to the leagues
			league.users.push(new LeagueUser(clients[1]._id.toString(), "CM", false));
      test.saveLeagueToDB(league, function(league){
				var headers = {'client-id' : clients[0]._id, 'league-id' : league._id};
				test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, headers, {matchDay : Date(), users: clients[0]._id }, function (err, res) {
					// Game created, now we add a new user to this game
					var responseText = res.body.responseText;
					var gameId = responseText._id;
					 headers = {'client-id' : clients[1]._id, 'league-id' : league._id};

					test.sendRequest(Constants.GET, path.BASE_GAME + path.PATH_GAME_ATTENDINGSTATUS_WITH_GAMEID + '/' + gameId + '/-1', headers , null, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.attending).eql(-1);
						// Now we check that the user has another game added to his activeGames
						test.getUserById(clients[1]._id, function(err, result) {
							expect(err).to.be.null;
							expect(result._id).eql(clients[1]._id);
							expect(result.activeGames.length).eql(1);
							done();
						});
				});
				});
  });
});
});
});


/**
 * This tests adding a user to a game
 */
// describe('#joinGameFull()', function() {
//   it('Add many users to a game until the game is closed ', function(done) {
// 		var methodTimeOutInSec = 4;
// 		this.timeout(methodTimeOutInSec * 1000);
//     var leagueName = 'addUsersToGameFullLeague';
// 		// Generate many users
// 		var userList = [];
// 		var max = 3;
// 		var makeTeamsAtNum = 2;
// 		for(var i = 0 ; i < max ; i++) {
// 			var userName = 'addUsersToGameFull' + i;
// 			var user = test.generateUser(userName);
// 			userList.push(user);
// 		}
//     test.saveUsersToDBBulk(userList, function(clients) {
//       var leagues = test.generateLeague(leagueName, clients[0], -1, makeTeamsAtNum);
// 			// Push another player to the leagues
// 			leagues.users.push(new LeagueUser(clients[1]._id.toString(), "CM", false));
// 			leagues.users.push(new LeagueUser(clients[2]._id.toString(), "CM", false));
//
//       test.saveLeagueToDB(leagues, function(leagues){
// 				var headers = {'client-id' : clients[0]._id, 'leagues-id' : leagues._id};
//
// 				 // Now each client will attempt to join the game in this leagues
// 				test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, headers, {matchDay : Date(), users: clients[0]._id }, function (err, res) {
// 					var responseText = res.body.responseText;
// 					logger.test('joinGameFull', "responseText:  " + responseText);
//
// 					var gameId = responseText._id;
// 					// Game created, now we add all the users to this game
// 					var method = Constants.GET;
// 					var requestPath = path.BASE_GAME + path.PATH_GAME_ATTENDINGSTATUS_WITH_GAMEID + '/' + gameId + '/1';
// 					 headers = {'client-id' : clients[1]._id, 'leagues-id' : leagues._id};
// 					test.sendRequest(method, requestPath, headers, null, function (err, res) {
// 						expect(err).to.be.null;
// 						expect(res).to.have.status(200);
// 						var body = res.body;
// 						expect(body).to.have.property('success').with.true;
// 						expect(body).to.have.property('responseText');
// 						// Now we should have 2 players in the game, try to add a third, game should be closed
// 						 headers = {'client-id' : clients[2]._id, 'leagues-id' : leagues._id};
// 						setTimeout(function(){
// 							test.sendRequest(method, requestPath, headers, null, function (err, res) {
// 								expect(err).to.be.null;
// 								expect(res).to.have.status(200);
// 								var body = res.body;
// 								expect(body).to.have.property('success').with.false;
// 								done();
// 							});
// 						}, 50);
// 				});
// 				});
//   });
// });
// });
// });

/**
 * This tests closing a game explicitily
 */
describe('#closeGame()', function() {
  it('Close a game (admin only) ', function(done) {
    var userName = 'closeGame';
    var leagueName = 'closeGameLeague';
    var user = test.generateUser(userName);
    test.saveUserToDB(user, function(client) {
      var league = test.generateLeague(leagueName, client);
      test.saveLeagueToDB(league, function(league){
				var game = test.generateGame(league._id, client);
				// save games to DB
				test.saveGameToDB(game, function(gameResult) {
					var headers = {'client-id' : client._id, 'league-id' : league._id};
					test.sendRequest(Constants.PUT, path.BASE_GAME + path.PATH_GAME_CHANGEGAMESTATUS_WITH_ID + '/' + gameResult._id, headers, {shouldCloseGame: true}, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						test.getGameById(gameResult._id, function(err, result) {
							expect(result.closed);
							done();
						});
					});
				})
      })
  });
});
});

describe('#buildGame()', function() {
  it('Build a game ', function(done) {
    var userName = 'buildGame';
    var leagueName = 'buildGameLeague';
    var user = test.generateUser(userName);
    test.saveUserToDB(user, function(client) {
      var league = test.generateLeague(leagueName, client);
      test.saveLeagueToDB(league, function(league){
				var game = test.generateGame(league._id, client);
				game.users = [
					{'_id' : 'Player0' , attending : 1, isInvite : false},
				{'_id' : 'Player10' , attending : -1, isInvite : false},
				{'_id' : 'Player1' , attending : 1, isInvite : false},
				{'_id' : 'Player2' , attending : 0, isInvite : false},
				{'_id' : 'Player3' , attending : 1, isInvite : false},
				{'_id' : 'Player4' , attending : 0, isInvite : false},
				{'_id' : 'Player5' , attending : 1, isInvite : false},
				{'_id' : 'Player6' , attending : 1, isInvite : false},
				{'_id' : 'Player7' , attending : 1, isInvite : false},
				{'_id' : 'Player8' , attending : 1, isInvite : false},
				{'_id' : 'Player9' , attending : 1, isInvite : false}];
				// save games to DB
				test.saveGameToDB(game, function(gameResult) {
					var headers = {'client-id' : client._id, 'league-id' : league._id};
					test.sendRequest(Constants.GET, path.BASE_GAME + path.PATH_GAME_BUILDGAME_WITH_ID + '/' + gameResult._id, headers, null, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						var responseText = body.responseText;
						expect(responseText.teamA.length > 0);
						expect(responseText.teamB.length > 1);
						done();
					});
				})
      })
  });
});
});


describe('#closeGameFail()', function() {
  it('Close a game but you are not an admin ', function(done) {
    var userName = 'closeGameFail';
    var leagueName = 'closeGameFailLeague';
    var user = test.generateUser(userName);
    test.saveUserToDB(user, function(client) {
      var league = test.generateLeague(leagueName, {'_id' : 'fakeClientId'});
      test.saveLeagueToDB(league, function(league){
				var game = test.generateGame(league._id, client);
				// save games to DB
				test.saveGameToDB(game, function(gameResult) {
					var headers = {'client-id' : client._id, 'league-id' : league._id};
					test.sendRequest(Constants.PUT, path.BASE_GAME + path.PATH_GAME_CHANGEGAMESTATUS_WITH_ID + '/' + gameResult._id, headers, {shouldCloseGame: true}, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.false;
						test.getGameById(gameResult._id, function(err, result) {
							expect(!result.closed);
							done();
						});
					});
				})
      })
  });
});
});

/**
 * This tests closing a game explicitily
 */
describe('#openGame()', function() {
  it('Open a game (admin only) ', function(done) {
    var userName = 'openGame';
    var leagueName = 'openGameLeague';
    var user = test.generateUser(userName);
    test.saveUserToDB(user, function(client) {
      var league = test.generateLeague(leagueName, client);
      test.saveLeagueToDB(league, function(league){
				var game = test.generateGame(league._id, client);
				// Close the game
				game.closed = true;
				// save games to DB
				test.saveGameToDB(game, function(gameResult) {
					var headers = {'client-id' : client._id, 'league-id' : league._id};
					test.sendRequest(Constants.PUT, path.BASE_GAME + path.PATH_GAME_CHANGEGAMESTATUS_WITH_ID + '/' + gameResult._id, headers, {shouldCloseGame: false}, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						test.getGameById(gameResult._id, function(err, result) {
							expect(result.closed);
							done();
						});
					});
				})
      })
  });
});
});



});
