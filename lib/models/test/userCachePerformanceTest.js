var chai = require('chai');
var expect = require('chai').expect;
var logger = require('../../framework/logger').init('userTest');
var test = require('../../framework/wpBasicTest');
var User = require('../Schemas/User');


var app = require("../../../app").getApp;

describe('User cache test', function() {
	before(function(done) {
		this.timeout(test.defaultTestTimeOut);
		//clear DB after all tests
		test.clearDB(function(err){
			if (err) return done(err);
			logger.test('clearDB', 'DB cleared for test');
			done();
		});
	});

	/**
	 * Test cache performance, should run with remote DB
	 */
	describe('#DbCache-getUserById', function() {
		it('Create a user, then get that user by ID 4 time', function(done) {
			var userName = 'getUser';
			// Generate a user 
			var user = test.generateUser(userName);
			test.saveUserToDB(user, function(client1) {
				logger.test('DbCache', 'saved client1: ' + client1._id);

				User.getUserById(client1._id, function(err, client2) {
					logger.test('DbCache', ' client2 ID: ' + client2._id);

					User.getUserById(client2._id, function(err, client3) {
						logger.test('DbCache', 'user2 found');

						User.getUserById(client3._id, function(err, client4) {
							logger.test('DbCache', 'user3 found');

							expect(client4.name).to.eql(userName);

							done();
						});
					});
				});
			});
		});
	});
});