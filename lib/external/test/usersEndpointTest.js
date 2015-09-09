var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;
var logger = require('../../framework/logger').init('usersEndpointTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest');
var Constants = require('../../utils/Constants');

chai.use(chaiHttp);

var app = require("../../../app").getApp;

describe('usersEndpoint.js, This test class tests the user endpoint', function() {

	before(function(done) {

			//clear db after all tests
		test.clearDB(function(err){
			if (err) return done(err);
			logger.test('clearDB', 'DB cleared for test');
			done();
		});
	});

	/**
	 * This tests the signup with happy flow, a new user registers and receives a clientId
	 */
	describe('#getUsersListById()', function() {
		it('get a list of users by id, save an array of users, then get this array by IDs ', function(done) {
      var userList = [];
      var max = 10;
      for(var i = 0 ; i < max ; i++) {
        var userName = 'getUsersListById' + i;
        var user = test.generateUser(userName);
        userList.push(user);
      }
      test.saveUsersToDBBulk(userList, function(clients) {
        // Saved a batch of users to the DB, now we try to get them
        var listOfClientIds = [];
        // Make a list of the client's IDs only
      for(var i = 0 ; i < max ; i++) {
        listOfClientIds.push(clients[i]._id);
      }
			chai.request(app)
			.post(path.ROOT + path.BASE_USERS + path.PATH_USERS_GETUSERSLIST_BY_ID)
      .set(Constants.CLIENT_ID_HEADER_KEY, clients[0]._id) // Sets the clientID header
			.send({users:listOfClientIds})
			.end(function (err, res) {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				var body = res.body;
				expect(body).to.have.property('success').with.true;
				expect(body).to.have.property('responseText');
				var responseText = body.responseText;
        expect(responseText.length).eql(max);
				done();
			});
		});
	});
});

});
