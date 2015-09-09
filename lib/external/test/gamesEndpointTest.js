var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;
var logger = require('../../framework/logger').init('gamesEndpointTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest');
var Constants = require('../../utils/Constants');

chai.use(chaiHttp);

var app = require("../../../app").getApp;

describe('gamesEndpoint.js, This test class tests the games endpoint', function() {

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
        test.saveLeagueToDB(league, function(league){
          chai.request(app)
          .post(path.ROOT + path.BASE_GAME + path.PATH_GAME_ADDGAME)
          .set(Constants.CLIENT_ID_HEADER_KEY, client.id) // Sets the clientID header
          .send({leagueId:league.id, matchDay : Date(), users: client.id })
          .end(function (err, res) {
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
        chai.request(app)
        .post(path.ROOT + path.BASE_GAME + path.PATH_GAME_ADDGAME)
        .set(Constants.CLIENT_ID_HEADER_KEY, clients[1]._id) // Sets the clientID header
        .send({leagueId:league.id, matchDay : Date(), users: clients[1]._id })
        .end(function (err, res) {
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

});
