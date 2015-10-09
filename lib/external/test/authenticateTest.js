var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;
var logger = require('../../utils/logger').init('authenticateTest');
var path = require('../../utils/Paths');
var test = require('../../framework/wpBasicTest')
chai.use(chaiHttp);

var app = require("../../../app").getApp;

describe('authenticate.js, This test class tests the authentication endpoint that holds signup, signin and forgot password', function() {

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
	 * This tests signs up many users with happy flow, each new user registers and receives a clientId
	 */
	describe('#stress test - signup() multiple users', function() {
		it('Attempts to sign up 20 users to see if the server can handle this', function(done) {
			for(var i = 0 ; i < 20 ; i++) {
				testSignInLoop(i, done);
			}
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
			var preRegisteredUser = test.generateUser(name);
			test.saveUserToDB(preRegisteredUser, function(client) {
				chai.request(app)
				.post(path.ROOT + path.BASE_AUTHENTICATE + path.PATH_AUTHENTICATE_SIGNUP)
				.send({email:client.email, password:client.password, name:'newName'})
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
			var preRegisteredUser = test.generateUser(name);
			test.saveUserToDB(preRegisteredUser, function(client) {

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
			var preRegisteredUser = test.generateUser(name);
			test.saveUserToDB(preRegisteredUser, function(client) {

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
			var preRegisteredUser = test.generateUser(name);
			test.saveUserToDB(preRegisteredUser, function(client) {
				// Start test
				chai.request(app)
				.get(path.ROOT + path.BASE_AUTHENTICATE + path.PATH_AUTHENTICATE_FORGOTPASSWORD_WITH_EMAIL + '/' + client.email)
				.end(function (err, res) {

					expect(err).to.be.null;
					expect(res).to.have.status(200);
					var body = res.body;
					expect(body).to.have.property('success').with.true;

					var responseText = body.responseText;
					expect(responseText).eql('email sent');
					done();
				});
			});
		});
	});
});

function testSignInLoop(index, done) {

	var email = 'signupSuccess'+index+'@gmail.com';
	var password = '1234';
	var name = 'signupSuccessName'+index;

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

		if(index == 19) {
			done();
		}

	});

};
