var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Constants = require('../../../utils/Constants.js');
var logger = require('../../../utils/logger').init('Notification');
var ObjectId = require('mongoose').Types.ObjectId;

var NotificationSchema   = new Schema({
  sender : {type : String, required : true, index: true },
	receiver : {type : String, required : true, index: true },
	message : {type : String, required: true},
	read: {type : Boolean, default : false},
	dateCreated: { type: Date, default: Date.now },
});

var Notification = mongoose.model('Notification', NotificationSchema);
module.exports.Notification = Notification;

module.exports.createNotification = function(senderId, receiverId, message, callback) {
	var notification = new Notification();      // create a new instance of the User model
	notification.receiver = receiverId;
  notification.sender = senderId;
	notification.message = message;
  notification.save(function(err) {
    if(callback)
      callback(err, notification);
  });
};

module.exports.markAsRead = function(notificationId, callback) {
  Notification.findByIdAndUpdate(new ObjectId(notificationId), {'$set' : {'read' : true}}, callback);
}

module.exports.getNotifications = function(ids, callback) {
  Notification.find({'_id': { $in: ids} }, callback);
}
