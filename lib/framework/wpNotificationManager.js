// Notification Manager, handles the type of messages sent, gets the messages for a client
var logger = require('../utils/logger').init('wpNotificationManager');
var Notification = require('../models/main/Schemas/Notification');
var users = require('../controllers/users');
var wpDate = require('./wpDate');
var leagues = require('../controllers/leagues');
var async = require('async');

var SYSTEM = "WEPLAY";

function notify(senderId, receiversIds, message) {
  async.forEachOf(receiversIds, function(receiver, key, callback){
    Notification.createNotification(senderId, receiver, message, function(err, result) {
      if(!err) {
        logger.debug('notify', 'Notification created for ' + receiver + ', message: ' + message);
        users.addNotification(receiver, result);
        callback();
      } else {
        logger.error('notify', 'could not send notification, reason : ' + err);
      }
    });
  });
}


module.exports.addUserToLeague = function(receiversIds, senderName, senderId, leagueName, isInvite) {
  var message = senderName + ' has joined the leagues \"' + leagueName + '\"';
  if(isInvite) message += ' as an Invite player';
  // Remove sender from receivers
  var indexOfSender = receiversIds.indexOf(senderId);
  if (indexOfSender > -1) {
    receiversIds.splice(indexOfSender, 1);
}
  notify(senderId, receiversIds, message);
}

module.exports.addGame = function(receiversLeagueUserObjects, senderId, leagueName, matchDay) {
  var receiverIds = [];
  // Get the IDs from the leagueUserObjects
  for(var i = 0 ; i < receiversLeagueUserObjects.length ; i++) {
    var currentId = receiversLeagueUserObjects[i]._id;
    if(currentId != senderId)
      receiverIds.push(receiversLeagueUserObjects[i]._id);
  }

  var message = 'New game in \"' + leagueName + '\" at ' + wpDate.displayDate(new Date(matchDay));
  notify(senderId, receiverIds, message);
};


module.exports.teamsBuilt = function(leaguesController, senderId, leagueId, matchDay) {
  leaguesController.getLeagueById(leagueId, function(err, result) {
    var receiverIds = [];
    var users = result.users;
    // Get the IDs from the leagueUserObjects
    for(var i = 0 ; i < users.length ; i++) {
      var currentId = users[i]._id;
      if(currentId != senderId)
        receiverIds.push(receiversLeagueUserObjects[i]._id);
    }

    var message = 'Yo! The teams have been made in \"' + leagueName + '\" for the next game at ' + wpDate.displayDate(new Date(matchDay));
    notify(senderId, receiverIds, message);

  });
};

module.exports.setTeams = function(leaguesController, leagueId, matchDay, teamArray, teamNumber) {
  leaguesController.getLeagueById(leagueId, function(err, result) {
    var leagueName = result.name;
    var receiverIds = [];

    // We need to notify every player in the team
    for(var i = 0 ; i < teamArray.length ; i++) {
      receiverIds.push(teamArray[i]._id);
    }
    var message = "Get Ready! You are playing in team #" + teamNumber + " in the next game at " + wpDate.displayDate(new Date(matchDay)) + ', in league ' + leagueName;
    notify(SYSTEM, receiverIds, message);
  });
}


module.exports.addAdmin = function(senderId, receiverId, leagueName) {
  var message = "You are now an admin in \"" + leagueName + '\"';
  notify(senderId, [receiverId], message);
}

module.exports.getNotifications = function(ids, callback) {
  Notification.getNotifications(ids, callback);
}

module.exports.markRead = function(notificationId, callback) {
  Notification.markAsRead(notificationId, callback);
}
