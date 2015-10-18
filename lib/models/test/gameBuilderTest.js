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
			var actualNumOfPlayers = 11;
      var gameObject = {'_id' : 'someGame', users : [
				{'_id' : 'Player0' , attending : 1},
			{'_id' : 'Player10' , attending : 1},
			{'_id' : 'Player1' , attending : 1},
			{'_id' : 'Player2' , attending : 1},
			{'_id' : 'Player3' , attending : 1},
			{'_id' : 'Player4' , attending : 1},
			{'_id' : 'Player5' , attending : 1},
			{'_id' : 'Player6' , attending : 1},
			{'_id' : 'Player7' , attending : 1},
			{'_id' : 'Player8' , attending : 1},
			{'_id' : 'Player9' , attending : 1}], teamA:[], teamB:[], invites:[], numOfPlayersPerTeam : numOfPlayersPerTeam};
      var returnedGame = gameBuilder.buildGame(gameObject);
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
		var gameObject = {'_id' : 'someGame', users : [
			{'_id' : 'Player0' , attending : -1},
		{'_id' : 'Player10' , attending : -1},
		{'_id' : 'Player1' , attending : -1},
		{'_id' : 'Player2' , attending : 0},
		{'_id' : 'Player3' , attending : 0},
		{'_id' : 'Player4' , attending : 0},
		{'_id' : 'Player5' , attending : 1},
		{'_id' : 'Player6' , attending : 1},
		{'_id' : 'Player7' , attending : -1},
		{'_id' : 'Player8' , attending : 1},
		{'_id' : 'Player9' , attending : 1}], teamA:[], teamB:[], invites:[], numOfPlayersPerTeam : numOfPlayersPerTeam};
		var returnedGame = gameBuilder.buildGame(gameObject);
		expect(returnedGame.teamA.length).eql(actualNumOfPlayers / 2);
		expect(returnedGame.teamB.length).eql(actualNumOfPlayers / 2);
		expect(returnedGame.invites.length).eql(0);
		done();
});
});

/**
 * This tests building a game with less than the max
 */
// describe('#buildGameWithLeagueInvites()', function() {
// 	it('build a game that is missing a few players from the home players, so they must take league invites ', function(done) {
// 		var numOfPlayersPerTeam = 10;
// 		var actualNumOfPlayers = 6;
// 		var gameObject = {'_id' : 'someGame', users : [
// 			{'_id' : 'Player0' , attending : -1},
// 		{'_id' : 'Player10' , attending : -1},
// 		{'_id' : 'Player1' , attending : -1},
// 		{'_id' : 'Player2' , attending : 0},
// 		{'_id' : 'Player3' , attending : 0},
// 		{'_id' : 'Player4' , attending : 0},
// 		{'_id' : 'Player5' , attending : 1},
// 		{'_id' : 'Player6' , attending : 1},
// 		{'_id' : 'Player7' , attending : -1},
// 		{'_id' : 'Player8' , attending : 1},
// 		{'_id' : 'Player9' , attending : 1},
// 		{'_id' : 'Player10' , attending : 2},
// 		{'_id' : 'Player11' , attending : 2}], teamA:[], teamB:[], invites:[], numOfPlayersPerTeam : numOfPlayersPerTeam};
// 		var returnedGame = gameBuilder.buildGame(gameObject);
// 		console.log(returnedGame);
// 		expect(returnedGame.teamA.length).eql(actualNumOfPlayers / 2);
// 		expect(returnedGame.teamB.length).eql(actualNumOfPlayers / 2);
// 		expect(returnedGame.invites.length).eql(0);
// 		done();
// });
// });
});
