
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Constants = require('../../../utils/Constants.js');
var logger = require('../../../utils/logger').init('User');
var cache = require('../../../framework/wpCache');

var UserSchema   = new Schema({
	name: {type : String, required : true, unique: true, minlength : 3, index: true },
	email : {type : String, required : true, unique: true, lowercase: true},
	password : {type : String, required: true, select: false},
	leagues: [{ type: String, minlength : 3 }],
	activeGames : [String],
	dateCreated: { type: Date, default: Date.now },
	authId : {type : Schema.Types.Mixed},
	profilePicURL : {type : String},
	notifications : [String]
});

var User = mongoose.model('User', UserSchema);
module.exports.User = User;

module.exports.addUser = function(userName, email, password, authId, profilePicURL, callback) {
	var user = new User();      // create a new instance of the User model
	user.name = userName;
	user.password = password;
	user.email = email;
	user.authId = authId;
	user.profilePicURL = profilePicURL;

	user.save(function(err) {
		if(!err){
			cache.setById( user._id, user);
			callback(null, user);
		} else {
			callback(err, null);
		}
	});

};

module.exports.getUsersListSearchQuery = function(keyword, callback) {
	var regex = new RegExp(keyword, "i");
	User.find({$or:[ {name : regex}, {email : regex} ]}, function(err, users) {
		if(err != null) {
			return callback(err, null);
		}
			return callback(null, users);
	}).limit(20);
};

module.exports.addNotification = function(receiversIds, notification, callback) {
	User.update({'_id': { $in: receiversIds} },
	{ $addToSet: { notifications: notification._id } },
	{multi:true, new:true}, function(err, result) {
		if(callback) callback(err, result);
	});
}

module.exports.getUsersListById = function(listOfClientIds, callback) {
	cache.getMultyObjectsByIDsArray( listOfClientIds, function( err, docs ){
		if( !err ){
			User.find({'_id': { $in: listOfClientIds} }, function(err, result) {
				if(err != null) {
					logger.test('getUsersListById', "failed to find, error: " + err);
					return callback(err, null);
				}

				if(result != null){
					var jsonResult = {};
					// Cache keys
					for(var i = 0; i < result.length; i++){
						cache.setById(result[i]._id, result[i]);
						jsonResult[result[i]._id] = result[i];
					}
					return callback(null, jsonResult);
				}

				return callback(null, null);
			});
		} else {
			callback(null, docs);
		}
	});
};

module.exports.getUserById = function( clientId , callback ) {
	cache.getById(clientId , function( err, client ) {
		if( !err ) {
			User.findById(clientId, function(err, client) {
				if(err != null) {
					return callback(err, null);
				}

				if(client != null){
					cache.setById( client.id, client);
					return callback(null, client);
				}

				return callback(null, null);
			});
		} else {
			logger.audit('getUserById', "client found in cache");
			callback(null, client);
		};
	});
};

//If shouldAdd is true, we add this gameId to the list of ActiveGames, if false, remove
module.exports.updateActiveGames = function( clientId , gameId, shouldAdd, callback ) {
	if(shouldAdd) {
		User.findByIdAndUpdate(clientId,{ $addToSet: { activeGames: [ gameId ] } }, {new:true} , function(err, client) {
			if(err != null) {
				return callback(err, null);
			}

			if(client != null){
				cache.setById( client.id, client);
				return callback(null, client);
			}

			return callback(null, null);
		});
	} else {
		User.findByIdAndUpdate(clientId,{ $pull: { activeGames: gameId } }, {new:true} , function(err, client) {
			if(err != null) {
				return callback(err, null);
			}

			if(client != null){
				cache.setById( client.id, client);
				return callback(null, client);
			}

			return callback(null, null);
		});
	}
};

//If shouldAdd is true, we add this leagueId to the list of leagues, if false, remove
module.exports.updateLeagues = function( clientId , leagueId, shouldAdd, callback ) {
	if(shouldAdd) {
		User.findByIdAndUpdate(clientId,{ $addToSet: { leagues:  leagueId  } }, {new: true}, function(err, client) {
			if(err != null) {
				return callback(err, null);
			}

			if(client != null){
				cache.setById( client.id, client);
				return callback(null, client);
			}

			return callback(null, null);
		});
	} else {
		User.findByIdAndUpdate(clientId,{ $pull: { leagues: leagueId } }, {new: true} , callback, function(err, client) {
			if(err != null) {
				return callback(err, null);
			}

			if(client != null){
				cache.setById( client.id, client);
				return callback(null, client);
			}

			return callback(null, null);
		});
	}

};

module.exports.getUserByName = function(userName, callback) {
	User.findOne({name : userName}, callback).select("-password");
};

module.exports.getUserByEmail = function(email, callback) {
	User.findOne({email : email.toLowerCase()}, callback).select("+password");
};

module.exports.authenticateUser = function(email, password, callback) {
	User.findOne({email : email.toLowerCase(), password: password}, callback).select("-password");
};

module.exports.updateUser = function(userId, params, callback) {
	User.findByIdAndUpdate(userId,  { $set: params}, {new:true}, callback, function(err, client) {
		if(err != null) {
			return callback(err, null);
		}

		if(client != null){
			cache.setById( client.id, client);
			return callback(null, client);
		}

		return callback(null, null);
	});
};
