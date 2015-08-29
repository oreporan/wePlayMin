var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../../config-test');
var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;

var logger = require('../../framework/logger').init('authenticateTest');
var path = require('../../utils/Paths');


chai.use(chaiHttp);
var User = require('../../models/Schemas').User;

var app = require("../../../app").getApp;

describe('authenticate.js, This test class tests the authentication endpoint that holds signup, signin and forgot password', function() {
	var url = 'localhost:3000';

	before(function(done) {
		//clear db after all tests
		var clearDB = require('mocha-mongoose')(config.db);
		clearDB(function(err){
			if (err) return done(err);
			done();
	  });
	});

	/**
	* This tests the signup with happy flow, a new user registers and receives a clientId
	*/
		describe('#signupSuccess()', function() {
			it('signup success, User should succesfully signup and receive back his user object', function(done) {
				var email = 'signupSuccess@gmail.com';
				var password = '1234';
				var name = 'signupSuccessName';

				chai.request(app)
				.post(path.ROOT + path.BASE_AUTHENTICATE + path.PATH_AUTHENTICATE_SIGNUP)
				.send({email:email, password:password, name:name})
				.end(function (err, res) {
					expect(err).to.be.null;
					expect(res).to.have.status(200);
					var body = res.body;
					expect(body).to.have.property('success').with.true;
					expect(body).to.have.property('responseText');

					var responseText = body.responseText;
					expect(responseText).to.have.property('clientId');

					done();
				});

			});

		});


		/**
		* This tests the signup with sad flow, a user attempts to register with an email/name that is already taken
		*/
		describe('#signupFailure()', function() {
			it('signup failure, User attempts to signup with an existing user, should fail', function(done) {
				var email = 'signupFailure@gmail.com';
				var password = '1234';
				var name = 'signupFailure';

				// Put a user in the DB, then try to register him again
				var preRegisteredUser = generateUserForTest(name);
				saveUserToDBForTest(preRegisteredUser, function(client) {
								chai.request(app)
								.post(path.ROOT + path.BASE_AUTHENTICATE + path.PATH_AUTHENTICATE_SIGNUP)
								.send({email:client.email, password:client.password, name:client.name})
								.end(function (err, res) {
									expect(err).to.be.null;
									expect(res).to.have.status(200);
									var body = res.body;
									expect(body).to.have.property('success').with.false;
									done();
								});
			});
		});
	});

		/**
		* This tests the sing in with happy flow, a registered user succesfully signs in
		*/
		describe('#signinSuccess()', function() {
			it('signin success,  a registered user succesfully signs in', function(done) {
				var email = 'signinSuccess@gmail.com';
				var password = '1234';
				var name = 'signinSuccess';

				// Put a user in the DB, then sign him in
				var preRegisteredUser = generateUserForTest(name);
				saveUserToDBForTest(preRegisteredUser, function(client) {

								chai.request(app)
								.post(path.ROOT + path.BASE_AUTHENTICATE + path.PATH_AUTHENTICATE_SIGNIN)
								.send({email:client.email, password:client.password})
								.end(function (err, res) {
									expect(err).to.be.null;
									expect(res).to.have.status(200);
									var body = res.body;
									expect(body).to.have.property('success').with.true;

									var responseText = body.responseText;
									expect(responseText).to.have.property('_id').eql(client.id);
									done();
								});
							});
			});
		});

		/**
		* This tests failed sign in, the user signs in with the wrong password
		*/
		describe('#signinFailure()', function() {
			it('signin failure,  a registered user fails to signs in due to wrong password', function(done) {
				var name = 'signinFailure';

				// Put a user in the DB, then try to register him again
				var preRegisteredUser = generateUserForTest(name);
				saveUserToDBForTest(preRegisteredUser, function(client) {

								chai.request(app)
								.post(path.ROOT + path.BASE_AUTHENTICATE + path.PATH_AUTHENTICATE_SIGNIN)
								.send({email:client.email, password:"wrongPassword"})
								.end(function (err, res) {
									expect(err).to.be.null;
									expect(res).to.have.status(200);
									var body = res.body;
									expect(body).to.have.property('success').with.false;

									var responseText = body.responseText;
									expect(responseText).to.be.null;
									done();
								});
							});
			});
		});

		/**
		* This tests a user that has clicked the 'forgotPassword' button, he recieves his password via email
		* but for now, it is returned in a JSON, this is still needs to be done (how to handle forgot password)
		*/
		describe('#forgotPassword()', function() {
			it('forgotPassword success,  a registered user gets his old password', function(done) {
				var name = 'forgotPassword';

				// Put a user in the DB, then try to register him again
				var preRegisteredUser = generateUserForTest(name);
				saveUserToDBForTest(preRegisteredUser, function(client) {
					// Start test
						chai.request(app)
						.get(path.ROOT + path.BASE_AUTHENTICATE + path.PATH_AUTHENTICATE_FORGOTPASSWORD_WITH_EMAIL + client.email)
						.end(function (err, res) {

						expect(err).to.be.null;
						expect(res).to.have.status(200);
						var body = res.body;
						expect(body).to.have.property('success').with.true;

						var responseText = body.responseText;
						expect(responseText).to.have.property('_id').eql(preRegisteredUser.id);
						expect(responseText).to.have.property('password').eql(preRegisteredUser.password);
						done();
						});
				});
			});
		});
});

function generateUserForTest(name) {
logger.debug('generateUserForTest', "Test, Generating a new user " + name);

	// create a new instance of the User model and save it in DB
	 var user = new User();
	 user.name = "name";
	 user.password = "testPassword";
	 user.leagues = [];
	 user.email = name + "@email.com";
	 user.attending = 0 ;

	 return user;
};

	function saveUserToDBForTest( user , callback) {
			user.save(function(err , client) {
			logger.debug('saveUserToDBForTest', "Test, Saved user to db - " + client.id);
				if(err) {
					throw err;
				}
				callback(client);
		});
	};
