var test = require('../../framework/wpBasicTest');
var Constants = require('../../utils/Constants');
var logger = require('../../utils/logger').init('matchesTest');
var path = require('../../utils/Paths');
var expect = require('chai').expect;
var LeagueUser = require('../../controllers/userObjects/LeagueUser');

describe('notificationsEndpointTest.js, This test classes tests the notificationEndpoint class', function() {
	before(function(done) {
		//clear db after all tests
		test.clearDB(function(err){
			if (err) return done(err);
			logger.test('clearDB', 'DB cleared for test');
			done();
		});
	});

  describe('#getNotification', function() {
    it('Create a notification, then get that notification by ID', function(done) {
      // Generate a user
      var user = test.generateUser('user');
      test.saveUserToDB(user, function(userFromDB){
        var note = test.generateNotification('sender', 'receiver', 'my message');
        test.saveNotificationToDB(note, function(notificationFromDB) {
          // Build request
          var method = Constants.POST;
          var headers = {'client-id' : userFromDB._id};
          var requestPath = path.BASE_NOTIFICATIONS + path.PATH_NOTIFICATIONS_GET_NOTIFICATIONS;

          // Send request
          test.sendRequest(method, requestPath, headers, {notifications : [notificationFromDB]}, function (err, res){
						var body = res.body;
	          expect(body).to.have.property('success').with.true;
	          expect(body).to.have.property('responseText');
						var responseText = body.responseText;
	          expect(responseText.notifications[0].sender).to.eql("sender");
            done();
          });
        });
      });
    });
  });

	describe('#markNotificationAsRead', function() {
		it('Create a notification, and mark it as read', function(done) {
			// Generate a user
			var user = test.generateUser('user');
			test.saveUserToDB(user, function(userFromDB){
				var note = test.generateNotification('sender', 'receiver', 'my message');
				test.saveNotificationToDB(note, function(notificationFromDB) {
					// Build request
					var method = Constants.GET;
					var headers = {'client-id' : userFromDB._id};
					var requestPath = path.BASE_NOTIFICATIONS + path.PATH_NOTIFICATIONS_MARK_AS_READ + '/' + notificationFromDB._id;

					// Send request
					test.sendRequest(method, requestPath, headers, null, function (err, res){
						var body = res.body;
						expect(body).to.have.property('success').with.true;
						// Now lets get the notification and see that its marked
						test.getNotificationById(notificationFromDB._id, function(err, result) {
							expect(result.read).eql(true);
							done();
						});
					});
				});
			});
		});
	});

describe('#addUserToLeagueNotification()', function() {
  it('Create a leagues, then push a user to that leagues, expect a notification', function(done) {
    var userName = 'addUserToLeague';
    var leagueName = 'addUserToLeague';
    // Generate a user so he can add a leagues
    var userAdmin = test.generateUser(userName);
    var userToPush = test.generateUser(userName + '1');
    var usersList = [userAdmin, userToPush];
    test.saveUsersToDBBulk(usersList, function(clients){
      // Both users are now added
      var league = test.generateLeague(leagueName, clients[0]);
      test.saveLeagueToDB(league, function(leagueFromDb) {

        // Build request
        var method = Constants.PUT;
        var headers = {'client-id' : clients[1]._id};
        var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADDUSERTOLEAGUE + '/' + leagueFromDb._id;

        // send request
        test.sendRequest(method, requestPath, headers, {position : "LM"}, function (err, res) {
          expect(err).to.be.null;
          var body = res.body;
          expect(body).to.have.property('success').with.true;
          expect(body).to.have.property('responseText');
          var responseText = body.responseText;
          expect(responseText.name).to.eql(leagueFromDb.name);
          // Now we check that this leagues has been added to the user's leagues array
          setTimeout(function(){
            // Wait one second to see if we get a notification
            test.getUserById(clients[0]._id, function(err, result) {
              expect(err).to.be.null;
              expect(result._id).eql(clients[0]._id);
              expect(result.notifications.length).eql(1);
              done();
            });
          }, 20);
        });
      });
    });
  });
});


describe('#addAdminNotification()', function() {
  it('Create a leaugue with an admin, then add another user to the leagues and make him admin, expect to get a notification', function(done) {
    var userName = 'addAdmin';
    var leagueName = 'addAdminLeague';
    // Generate a user so he can add a leagues
    var user = test.generateUser(userName);
    var anotherUser = test.generateUser(userName + 'Another');
    var usersList = [user, anotherUser];
    test.saveUsersToDBBulk(usersList, function(clients) {
      var league = test.generateLeague(leagueName, clients[0]);
      // Add another user to the leagues
      league.users.push(new LeagueUser(clients[1]._id, "CM", false));

      test.saveLeagueToDB(league, function(leagueFromDB) {

        // Build request
        var method = Constants.PUT;
        var headers = {'client-id' : clients[0]._id};
        var requestPath = path.BASE_LEAGUES + path.PATH_LEAGUES_ADD_ADMIN_WITH_LEAGUE_ID + '/' + leagueFromDB._id;

        // Send request
        test.sendRequest(method, requestPath, headers, {admin : clients[1]._id}, function (err, res) {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
          var body = res.body;
          expect(body).to.have.property('success').with.true;
          expect(body).to.have.property('responseText');
          var responseText = body.responseText;
          expect(responseText.admins.length).eql(2);
          setTimeout(function(){
            // Wait one second to see if we get a notification
            test.getUserById(clients[1]._id, function(err, result) {
              expect(err).to.be.null;
              expect(result.notifications.length).eql(1);
              done();
            });
          }, 20);
        });
      });
    });
  });
});

});
