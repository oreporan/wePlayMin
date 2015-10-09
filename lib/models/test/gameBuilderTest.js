var gameBuilder = require('../main/gameBuilder');
var expect = require('chai').expect;
var Constants = require('../../utils/Constants');
var logger = require('../../utils/logger').init('matchesTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest');
var wpDate = require('../../framework/wpDate');

describe('gameBuilder.js, This test classes tests the gamebuilder model', function() {
	before(function(done) {
		//clear db after all tests
		test.clearDB(function(err){
			if (err) return done(err);
			logger.test('clearDB', 'DB cleared for test');
			done();
		});
	});

  /**
	 * This tests building a game with invites
	 */
	describe('#buildGameWithInvites()', function() {
		it('build a game ', function(done) {
      var numOfPlayersPerTeam = 3;
			var actualNumOfPlayers = 10;
      var gameObject = {users : ['Player1','Player2','Player3','Player4','Player5','Player6','Player7','Player8', 'Player9', 'Player10'], teamA:[], teamB:[], invites:[]};
      var returnedGame = gameBuilder.buildGame(gameObject, numOfPlayersPerTeam);
      expect(returnedGame.teamA.length).eql(numOfPlayersPerTeam);
      expect(returnedGame.teamB.length).eql(numOfPlayersPerTeam);
      expect(returnedGame.invites.length).eql(actualNumOfPlayers - (numOfPlayersPerTeam * 2));
      done();
	});
});

/**
 * This tests building a game with less than the max
 */
describe('#buildGameLessThanMax()', function() {
	it('build a game that is missing a few players ', function(done) {
		var numOfPlayersPerTeam = 10;
		var actualNumOfPlayers = 4;
		var gameObject = {users : ['Player1','Player2','Player3','Player4'], teamA:[], teamB:[], invites:[]};
		var returnedGame = gameBuilder.buildGame(gameObject, numOfPlayersPerTeam);
		expect(returnedGame.teamA.length).eql(actualNumOfPlayers / 2);
		expect(returnedGame.teamB.length).eql(actualNumOfPlayers / 2);
		expect(returnedGame.invites.length).eql(0);
		done();
});
});
});
