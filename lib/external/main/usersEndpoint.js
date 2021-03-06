var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
var wpResponse = require('../../framework/wpResponse');
var users = require('../../controllers/users');
//Init the logger
var logger = require('../../utils/logger').init('usersEndpoint');
var path = require('../../utils/Paths');
app.use(path.BASE_USERS, router);

//Path : /users Method: GET
router.get(path.PATH_USERS_GETUSER_WITH_NAME + '/:name', getUserByName);
function getUserByName(req, res) {
	users.getUserByName(req.params.name, function(err, user) {
		if (err != null){
			logger.error('getUserByName', "could not get user " + req.params.name + ", error:" + err.msg);
			res.send(wpResponse.sendResponse(false, null, err , err.errmsg));
			return;
		}
		if(user == null){
			res.send(wpResponse.sendResponse(false, null, "no user error", "No User exists in the Database", "User: " + req.params.name + ", does not exist in the database"));
		} else {
			res.send(wpResponse.sendResponse(true, user));
		}
	});
};

//Path : /users/:user_name Method: POST
router.post(path.PATH_USERS_GETUSERSLIST_BY_ID, getUsersListById);
function getUsersListById(req, res) {
	users.getUsersListById(req.body.users, function(err, listOfUsers) {
		if (err != null){
			logger.error('getUsersListById', "could not get users" + req.body.users + ", error:" + err.msg);
			res.send(wpResponse.sendResponse(false, null, err , err.msg));
			return;
		}
		if(listOfUsers != null && listOfUsers.length <= 0){
			res.send(wpResponse.sendResponse(false, null, "Could not get list of users", "No users were found with these clientIds"));
		} else {
			res.send(wpResponse.sendResponse(true, listOfUsers));
		}
	});
};

//Path : /users/:user_id Method: GET
router.get(path.PATH_USERS_GETUSER_WITH_ID + '/:user_id', getUserById);
function getUserById(req, res) {
	users.getUserById(req.params.user_id, function(err, user) {
		if (err != null){
			res.send(wpResponse.sendResponse(false, null, err, err.msg));
			return;
		}
		if(user == null){
			res.send(wpResponse.sendResponse(false, null, "no user error", "No User exists in the Database", "User: " + req.params.name + ", does not exist in the database"));
		} else {
			logger.debug('getUserById', 'user ' + req.params.user_id +  ' found')
			res.send(wpResponse.sendResponse(true, user));
		}
	});
};

router.get(path.PATH_USERS_GETUSERSBYKEYWORD + '/:keyword', getUsersListSearchQuery);
function getUsersListSearchQuery(req, res) {
	var keyword = req.params.keyword;
	logger.audit('getUsersListSearchQuery' , 'get Users: ' + keyword);
	users.getUsersListSearchQuery(keyword, function(err, users) {
		if(err != null) {
			logger.warn('getUsersListSearchQuery' , 'could not get Users: ' + keyword + ', reason : ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not get league by name", err));
			return;
		}
		logger.audit('getUsersListSearchQuery' , 'returning all users with this pattern :  ' + keyword);
		res.send(wpResponse.sendResponse(true, {'users' : users}));
		return;
	});
};

//Path : /users/:user_id Method: PUT
router.put(path.PATH_USERS_UPDATEUSER_WITH_ID + '/:user_id', updateUser);
function updateUser(req, res) {
	var userId = req.params.user_id;
	var params = req.body;
	logger.audit('updateUser' , 'updating User: ' + userId + ' with params: ' + JSON.stringify(params) + ' to users DB');
	users.updateUser(userId, params, function(err, user) {
		if(err != null) {
			logger.error('updateUser' , 'Could not update user: ' + userId + ' with params: ' + JSON.stringify(params) + ', error - ' + err);
			res.send(wpResponse.sendResponse(false, null, "Could not update User", err));
			return;
		} else {
			res.send(wpResponse.sendResponse(true, user));
		}
	});

};
