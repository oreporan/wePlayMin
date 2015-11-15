// Notification Manager, handles the type of messages sent, gets the messages for a client
var logger = require('../utils/logger').init('wpNotificationManager');
var Notification = require('../models/main/Schemas/Notification');
var users = require('../controllers/users');

function notify(senderId, receiverId, message) {
  Notification.createNotification(senderId, receiverId, message, function(err, result) {
    if(!err) {
      logger.audit('notify', 'Notification created for ' + receiverId + ', message:' + message);
      users.addNotification(result.receiver, result);
    }
  });
}


module.exports.addUserToLeague = function(receiversIds, senderName, senderId, leagueName) {
  var message = senderName + ' has joined the league ' + leagueName;
  notify(senderId, receiversIds, message);
}


module.exports.addAdmin = function(senderId, receiverId, leagueName) {
  var message = "You are now an admin in " + leagueName;
  notify(senderId, receiverId, message);
}

module.exports.getNotifications = function(ids, callback) {
  Notification.getNotifications(ids, callback);
}
