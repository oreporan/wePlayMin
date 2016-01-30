var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
var wpResponse = require('../../framework/wpResponse');
var Constants = require('../../utils/Constants');

//Init the logger
var logger = require('../../utils/logger').init('notificationsEndpoint');
var wpNotificationManager = require('../../framework/wpNotificationManager');

var path = require('../../utils/Paths');
app.use(path.BASE_NOTIFICATIONS, router);

router.get(path.PATH_NOTIFICATIONS_MARK_AS_READ + '/:notificationId', markAsRead);
function markAsRead(req, res) {
	var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var note = req.params.notificationId;
	logger.debug('markAsRead' , 'Marking notification ' + note + ' as read for client - ' + clientId);
	wpNotificationManager.markRead(note, function(err, result) {
		if(err || !result) {
			logger.error('markAsRead' ,'Coult not make notification as read');
			res.send(wpResponse.sendResponse(false, null, "Could not mark notification", err));
		}
		logger.debug('markAsRead' ,'notification marked as read');
		res.send(wpResponse.sendResponse(true, "notification marked as read"));
		return;
	});
};

//Path : /wePlay/leagues/getLeagueByName/:name Method: POST
router.post(path.PATH_NOTIFICATIONS_GET_NOTIFICATIONS, getNotifications);
function getNotifications(req, res) {
	var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	var notes = req.body.notifications;
	logger.debug('getNotifications' , 'getting notifications for client - ' + clientId);
	wpNotificationManager.getNotifications(notes, function(err, arrayOfNotifications) {
		if(err != null) {
			logger.warn('getNotifications' , 'could not get notifications, reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not get notifications", err));
			return;
		}
		logger.debug('getNotifications' , arrayOfNotifications.length + ' notifications retrieved');
		res.send(wpResponse.sendResponse(true, {'notifications' : arrayOfNotifications}));
		return;
	});
};
