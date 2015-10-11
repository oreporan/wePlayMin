
var expect = require('chai').expect;
var logger = require('../../utils/logger').init('gamesEndpointTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest');
var Constants = require('../../utils/Constants');

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
		it('Create a user, a league, and a game in this league, expect to get the updated league back ', function(done) {
      var userName = 'addGame';
      var leagueName = 'addGameLeague';
      var user = test.generateUser(userName);
      test.saveUserToDB(user, function(client) {
        var league = test.generateLeague(leagueName, client);
				// Save another user to the league
				league.users.push('anotherUser');
        test.saveLeagueToDB(league, function(league){
					test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, {'client-id' : client._id}, {leagueId:league.id, matchDay : Date(), users: client.id }, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.games.length).eql(1);
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
  it('Create a user, a league, and attempt to create a game, but you are not the admin! ', function(done) {
    var userName = 'addGameFailure';
    var leagueName = 'addGameFailureLeague';
    var user = test.generateUser(userName);
    var userB = test.generateUser(userName + 'B');
    var listOfUsers = [user, userB];
    test.saveUsersToDBBulk(listOfUsers, function(clients) {
      var league = test.generateLeague(leagueName, clients[0]);
      test.saveLeagueToDB(league, function(league){
				test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, {'client-id' : clients[1]._id}, {leagueId:league.id, matchDay : Date(), users: clients[1]._id }, function (err, res) {
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
					gamesArray.push(test.generateGame(league._id, client._id));
				}

				// save games to DB
				test.saveGamesToDBBulk(gamesArray, function(listOfGames) {
					test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_GETGAMELIST, {'client-id' : client._id}, {games: listOfGames}, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.length).eql(numOfGames);
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
describe('#addUserToGame()', function() {
  it('Add a new user to an existing game ', function(done) {
    var userName = 'addUserToGame';
    var leagueName = 'addUserToGameLeague';
    var userA = test.generateUser(userName);
    var userB = test.generateUser(userName + "B");
    var listOfUsers = [userA, userB];
    test.saveUsersToDBBulk(listOfUsers, function(clients) {
      var league = test.generateLeague(leagueName, clients[0]);
      test.saveLeagueToDB(league, function(league){
				test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, {'client-id' : clients[0]._id}, {leagueId:league.id, matchDay : Date(), users: clients[0]._id }, function (err, res) {
					// Game created, now we add a new user to this game
					var responseText = res.body.responseText;
					var gameId = responseText.games[0];
					test.sendRequest(Constants.GET, path.BASE_GAME + path.PATH_GAME_ADDUSERTOGAME_WITH_GAMEID + '/' + gameId, {'client-id' : clients[1]._id}, null, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.users.length).eql(2);
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

/**
 * This tests adding a user to a game
 */
describe('#addUsersToGameFull()', function() {
  it('Add many users to a game until the game is closed ', function(done) {
		var methodTimeOutInSec = 4;
		this.timeout(methodTimeOutInSec * 1000);
    var leagueName = 'addUsersToGameFullLeague';
		// Generate many users
		var userList = [];
		var max = 3;
		var makeTeamsAtNum = 2;
		for(var i = 0 ; i < max ; i++) {
			var userName = 'addUsersToGameFull' + i;
			var user = test.generateUser(userName);
			userList.push(user);
		}
    test.saveUsersToDBBulk(userList, function(clients) {
      var league = test.generateLeague(leagueName, clients[0], -1, makeTeamsAtNum);
      test.saveLeagueToDB(league, function(league){
				 // Now each client will attempt to join the game in this league
				test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, {'client-id' : clients[0]._id}, {leagueId:league.id, matchDay : Date(), users: clients[0]._id }, function (err, res) {
					var responseText = res.body.responseText;
					var gameId = responseText.games[0];
					// Game created, now we add all the users to this game
					var method = Constants.GET;
					var requestPath = path.BASE_GAME + path.PATH_GAME_ADDUSERTOGAME_WITH_GAMEID + '/' + gameId;
					var headers = {'client-id' : clients[1]._id};
					test.sendRequest(method, requestPath, headers, null, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');

						// Now we should have 2 players in the game, try to add a third, game should be closed
						var headers = {'client-id' : clients[2]._id};
						setTimeout(function(){
							test.sendRequest(method, requestPath, headers, null, function (err, res) {
								expect(err).to.be.null;
								expect(res).to.have.status(200);
								var body = res.body;
								expect(body).to.have.property('success').with.false;
								done();
							});
						}, (methodTimeOutInSec / 2) * 1000);
				});
				});
  });
});
});
});

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
				var game = test.generateGame(league._id, client._id);
				// save games to DB
				test.saveGameToDB(game, function(gameResult) {
					test.sendRequest(Constants.GET, path.BASE_GAME + path.PATH_GAME_CLOSEGAME_WITH_ID + '/' + gameResult._id, {'client-id' : client._id}, null, function (err, res) {
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
