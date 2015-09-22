var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;
var logger = require('../../framework/logger').init('usersEndpointTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest');
var Constants = require('../../utils/Constants');

chai.use(chaiHttp);

var app = require("../../../app").getApp;

describe('usersEndpointTest.js, This test classes tests the usersEndpoint class', function() {
	before(function(done) {
		this.timeout(4000);
		//clear db after all tests
		test.clearDB(function(err){
			if (err) return done(err);
			logger.test('clearDB', 'DB cleared for test');
			done();
		});
	});


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

	/**
	 * This tests getting a getUserByName happy flow
	 */
	describe('#' + path.PATH_USERS_GETUSER_WITH_NAME, function() {
		it('Create a user, then get that user by name', function(done) {
			var userName = 'getUserByName';
			// Generate a user so he can add a league
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				chai.request(app)
				.get(path.ROOT + path.BASE_USERS + path.PATH_USERS_GETUSER_WITH_NAME + '/' + client.name)
				.set(Constants.CLIENT_ID_HEADER_KEY, user._id) // Sets the clientID header
				.end(function (err, res) {
					expect(err).to.be.null;
					var body = res.body;
					expect(body).to.have.property('success').with.true;
					expect(body).to.have.property('responseText');
					var responseText = body.responseText;
					expect(responseText.name).to.eql(client.name);
					expect(responseText.email).to.eql(client.email);
					done();
				});
			});
		});
	});

	/**
	 * This tests getting a user by id happy flow
	 */
	describe('#' + path.PATH_USERS_GETUSER_WITH_ID, function() {
		it('Create a user, then get that user by ID', function(done) {
			var userName = 'getUser';
			// Generate a user 
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				chai.request(app)
				.get(path.ROOT + path.BASE_USERS + path.PATH_USERS_GETUSER_WITH_ID + '/' + client._id)
				.set(Constants.CLIENT_ID_HEADER_KEY, user._id) // Sets the clientID header
				.end(function (err, res) {
					expect(err).to.be.null;
					var body = res.body;
					expect(body).to.have.property('success').with.true;
					expect(body).to.have.property('responseText');
					var responseText = body.responseText;
					expect(responseText.name).to.eql(client.name);
					expect(responseText.email).to.eql(client.email);
					done();
				});
			});
		});
	});

	/**
	 * This test updateUser by id happy flow
	 */
	describe('#' + path.PATH_USERS_UPDATEUSER_WITH_ID, function() {
		it('Create a user, then update that user by Name and Email', function(done) {
			var userName = 'testUser';
			var updatedName = 'updateName';
			var updatedEmail = 'updateUser@email.com';
			// Generate a user 
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client) {
				chai.request(app)
				.put(path.ROOT + path.BASE_USERS + path.PATH_USERS_UPDATEUSER_WITH_ID + '/' + client._id)
				.set(Constants.CLIENT_ID_HEADER_KEY, user._id) // Sets the clientID header
				.send({ name: updatedName, email: updatedEmail})
				.end(function (err, res) {
					expect(err).to.be.null;
					var body = res.body;
					expect(body).to.have.property('success').with.true;
					expect(body).to.have.property('responseText');
					var responseText = body.responseText;
					expect(responseText.name).to.eql(updatedName);
					expect(responseText.email).to.eql(updatedEmail);
					done();
				});
			});
		});
	});

	/**
	 * This test the updateUser by id failure flow. Create 2 users, and update one user to be named like the other one.
	 */
	describe('#' + path.PATH_USERS_UPDATEUSER_WITH_ID + "failure", function() {
		it('Create 2 users, and update one user to be named like the other one, should fail', function(done) {
			var userName = 'updateUserFailure';
			var user1 = test.generateUser(userName);
			var user2 = test.generateUser(userName + "2");

			var userList = [user1, user2];
			test.saveUsersToDBBulk(userList, function(clients) {
				var listOfClientIds = [clients[0]._id, clients[1]._id];
				chai.request(app)
				.put(path.ROOT + path.BASE_USERS + path.PATH_USERS_UPDATEUSER_WITH_ID + '/' + clients[0]._id)
				.set(Constants.CLIENT_ID_HEADER_KEY, clients[0]._id) // Sets the clientID header
				.send({ name: user2.name })
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

