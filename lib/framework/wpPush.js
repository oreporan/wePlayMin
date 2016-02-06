var gcm = require('node-gcm');
var logger = require('../utils/logger').init('wpPush');

// Set up the sender with you API key
var sender = new gcm.Sender('AIzaSyCjN6otSXVF0C0lGOy1UJBHpQGWhJV2j4o');

// ... or some given values
var message = new gcm.Message({
  collapseKey: 'demo',
  priority: 'high',
  contentAvailable: true,
  delayWhileIdle: true,
  timeToLive: 3,
  restrictedPackageName: "somePackageName",
  dryRun: true,
  data: {
    key1: 'message1',
    key2: 'message2'
  },
  notification: {
    title: "Hello, World",
    icon: "ic_launcher",
    body: "This is a notification that will be displayed ASAP."
  }
});

module.exports.sendPushToUser = function(registrationToken, messageData) {
  message.addData({
    key1: messageData
  });

  // Send the message
  sender.send(message, {
    to: registrationToken
  }, 10, function(err, response) {
    if (err) logger.error(err);
    else logger.audit(response);
  });
};

module.exports.sendPushToUsers = function(registrationTokens, messageData) {
  message.addData({
    key1: messageData
  });

  // Send the message
  sender.send(message, {
    registrationTokens: registrationTokens
  }, 10, function(err, response) {
    if (err) logger.error(err);
    else logger.audit(response);
  });
};
