// Test all things that have to do with making matches
var matches = require('../main/matches');

var expect = require('chai').expect;
var Constants = require('../../utils/Constants');
var logger = require('../../utils/logger').init('matchesTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest');
var wpDate = require('../../framework/wpDate');

describe('matchesTest.js, This test classes tests the matches controller', function() {
	before(function(done) {
		//clear db after all tests
		test.clearDB(function(err){
			if (err) return done(err);
			logger.test('clearDB', 'DB cleared for test');
			done();
		});
	});

	/**
	 * This tests creating a match
	 */
	describe('#initMatches()', function() {
		it('create matches, then init them all ', function(done) {
			var numOfMatches = 3;
			var gameId = 'fakeGameId';
			this.timeout((numOfMatches + 3) * 1000);
			var matchesList = [];
			for(var i = 0 ; i < numOfMatches ; i++) {
				// Make a game i + 0.5 seconds from now
				matchesList.push(test.generateMatch(gameId + i, wpDate.dateAdd(Date(), 'second' ,1 + i)));
			}
			test.saveMatchesToDBBulk(matchesList, function(err, matchesResult) {
				// test method
				matches.initMatches();

				// expect to init 3 matches
				setTimeout(function(){
					// Check that all matches were destroyed
					test.getMatchById(matchesResult[numOfMatches - 1]._id, function(err, result) {
						expect(result).to.be.null;
						expect(err).to.be.null;
						done();
					});
				}, numOfMatches * 1000);
			});
	});
});


  /**
	 * This tests creating a match
	 */
	describe('#createMatch()', function() {
    var matchDayInSec = 3; // When the game should be played
    var waitForMatchDay = matchDayInSec + 2; // how long to wait until checking if game was played
    var methodTimeOutInSec = waitForMatchDay + 1; // timeout for the method

    this.timeout(methodTimeOutInSec * 1000);
		it('create a user, a league, a game that is set for 3 seconds from now, with frequency == -1, this test will have to wait 3 seconds ', function(done) {
      var userName = 'createMatch';
      var leagueName = 'createMatchLeague';
      var matchDay = wpDate.dateAdd(Date(), 'second', matchDayInSec);
      var user = test.generateUser(userName);
      test.saveUserToDB(user, function(client) {
        var league = test.generateLeague(leagueName, client);
        test.saveLeagueToDB(league, function(league){
					test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, {'client-id' : client._id}, {leagueId:league.id, matchDay : matchDay, users: client.id }, function (err, res) {
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						expect(body).to.have.property('responseText');
						var responseText = body.responseText;
						expect(responseText.games.length).eql(1);
            var gameId = responseText.games[0];

            // We should have a match created here
            test.getMatchByGameId(gameId, function(err, result) {
              expect(err).to.be.null;
              expect(result.gameId).eql(gameId);

								// Wait for cronjob to be ready
								setTimeout(function(){
									test.getMatchByGameId(gameId, function(err, result) {
										// Now we should not find a match because it was destroyed
										expect(result).to.be.null;
										// The user's active game's list should be empty
										test.getUserById(client._id, function(err, userResult){
										expect(userResult.activeGames.length).eql(0);
										done();
									})
							});
								}, waitForMatchDay * 1000);

            })
					});
        })
		});
	});
});


/**
 * This tests creating a match with frequency
 */
describe('#createMatchWithWeeklyFrequency()', function() {
  var matchDayInSec = 3; // When the game should be played
  var waitForMatchDay = matchDayInSec + 2; // how long to wait until checking if game was played
  var methodTimeOutInSec = waitForMatchDay + 1; // timeout for the method

  this.timeout(methodTimeOutInSec * 1000);
  it('create a user, a league, a game that is set for 3 seconds from now, with frequency == 0, so the game should reoccur next week ', function(done) {
    var userName = 'createMatch';
    var leagueName = 'createMatchLeague';
    var matchDay = wpDate.dateAdd(Date(), 'second', matchDayInSec);
    var user = test.generateUser(userName);
    test.saveUserToDB(user, function(client) {
      var league = test.generateLeague(leagueName, client, 0);
      test.saveLeagueToDB(league, function(league){
        test.sendRequest(Constants.POST, path.BASE_GAME + path.PATH_GAME_ADDGAME, {'client-id' : client._id}, {leagueId:league.id, matchDay : matchDay, users: client.id }, function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          var body = res.body;
          expect(body).to.have.property('success').with.true;
          expect(body).to.have.property('responseText');
          var responseText = body.responseText;
          expect(responseText.games.length).eql(1);
          var gameId = responseText.games[0];
          // Wait for cronjob to be ready
          setTimeout(function(){
            // We should have two games in the league
            test.getLeagueById(league._id, function(err, result) {
              expect(result.games.length).eql(2);
							done();
            });
          }, waitForMatchDay * 1000);
        });
      })
  });
});
});
});
