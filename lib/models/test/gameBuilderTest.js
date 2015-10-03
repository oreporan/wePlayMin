var gameBuilder = require('../main/gameBuilder');
var expect = require('chai').expect;
var Constants = require('../../utils/Constants');
var logger = require('../../framework/logger').init('matchesTest');
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
	 * This tests creating a match
	 */
	describe('#buildGame()', function() {
		it('build a game ', function(done) {
      var numOfPlayersPerTeam = 3;
      var gameObject = {users : ['Player1','Player2','Player3','Player4','Player5','Player6','Player7','Player8'], teamA:[], teamB:[], invites:[]};
      var returnedGame = gameBuilder.buildGame(gameObject, numOfPlayersPerTeam);
      expect(returnedGame.teamA.length).eql(3);
      expect(returnedGame.teamB.length).eql(3);
      expect(returnedGame.invites.length).eql(2);
      done();
	});
});
});
