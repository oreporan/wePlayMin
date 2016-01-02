// Notification Manager, handles the type of messages sent, gets the messages for a client
var logger = require('../utils/logger').init('wpNotificationManager');
var Notification = require('../models/main/Schemas/Notification');
var users = require('../controllers/users');
var wpDate = require('./wpDate');
var async = require('async');

function notify(senderId, receiversIds, message) {
  async.forEachOf(receiversIds, function(receiver, key, callback){
    Notification.createNotification(senderId, receiver, message, function(err, result) {
      if(!err) {
        logger.audit('notify', 'Notification created for ' + receiver + ', message: ' + message);
        users.addNotification(receiver, result);
        callback();
      }
    });
  });
}


module.exports.addUserToLeague = function(receiversIds, senderName, senderId, leagueName, isInvite) {
  var message = senderName + ' has joined the league \"' + leagueName + '\"';
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
