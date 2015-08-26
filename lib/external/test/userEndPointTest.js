var request = require('supertest');  
var mongoose = require('mongoose');
var config = require('../../config-test');
var chai = require('chai')
, chaiHttp = require('chai-http');
var expect = require('chai').expect;

chai.use(chaiHttp);
var User = require('../../models/Schemas').User;

var app = require("../../../app").getApp;

describe('Users', function() {
	var url = 'localhost:3000';

	before(function(done) {

		 // create a new instance of the User model and save it in DB
			var user = new User();     
			user.name = "testName";
			user.password = "testPassword";
			user.leagues = [];
			user.email = "test@email.com";
			user.attending = 0 ;

			// save the user and check for errors
			user.save(function(err , clientId) {
				if(err) {
					throw err;
				}
			});
			done();

	});		


	after(function(done) {		
		//clear db after all tests
		var clearDB = require('mocha-mongoose')(config.db);
		clearDB(function(err){
			if (err) return done(err);
			done();
	  });
	});	
		
	
	
//	use describe to give a title to your test suite, in this case the tile is "Account"
//	and then specify a function in which we are going to declare all the tests
//	we want to run. Each test starts with the function it() and as a first argument 
//	we have to provide a meaningful title for it, whereas as the second argument we
//	specify a function that takes a single parameter, "done", that we will use 
//	to specify when our test is completed, and that's what makes easy
//	to perform async test!
	describe('#getUserByName()', function() {
		it('getUserByName, should return 200', function(done) {


			chai.request(app)
			.get('/users/getUsersByName/testName')
			.end(function (err, res) {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				var body = res.body;
				expect(body).to.have.property('success').with.true;
				expect(body).to.have.property('responseText');

				var responseText = body.responseText;
				expect(responseText).to.have.property('name').eql('testName');
				expect(responseText).to.have.property('email').eql('test@email.com');

				done();
			});

		});

	});
});