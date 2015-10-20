
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Constants = require('../../../utils/Constants.js');
var logger = require('../../../utils/logger').init('User');


var NodeCache = require( "node-cache" );
var cache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

var UserSchema   = new Schema({
	name: {type : String, required : true, unique: true, minlength : 3 },
	email : {type : String, required : true, unique: true},
	password : {type : String, required: true, select: false},
	leagues: [{ type: String, minlength : 3 }],
	activeGames : [String],
	dateCreated: { type: Date, default: Date.now }
});

var User = mongoose.model('User', UserSchema);
module.exports.User = User;

module.exports.addUser = function(userName, email, password, callback) {
	var user = new User();      // create a new instance of the User model
	user.name = userName;
	user.password = password;
	user.leagues = [];
	user.activeGames = [];
	user.email = email;

	user.save(function(err, savedUser) {
		cache.set( savedUser.id, user, function( err, success ){
			if( !err && success ){
				callback(null, savedUser);
			} else {
				callback(err, null);
			}
		});
	});

};

module.exports.getUsersListById = function(listOfClientIds, callback) {
	cache.mget( listOfClientIds, function( err, docs ){
		if( !err ){
			if(Object.keys(docs).length < listOfClientIds.length) {
				// key not found
				// find key in db
				User.find({'_id': { $in: listOfClientIds} }, function(err, result) {
					if(err != null) {
						logger.error('getUsersListById', "failed to find, error: " + err);
						callback(err, null);
					} else {
						var jsonResult = {};
						// Cache keys
						for(var i = 0; i < result.length; i++){
							cache.set(result[i]._id, result[i]);
							jsonResult[result[i]._id] = result[i];
						}
						callback(null, jsonResult);
					}
				});
			} else {
				logger.audit('getUsersListById', "list of clients found in cache");
				callback(null, docs);
			}

		} else {
			callback(err, null);
		}
	});
}

module.exports.getUserById = function( clientId , callback ) {
	cache.get( clientId , function( err, client ){
		if( !err ){
			if(client == undefined){
				// key not found
				logger.audit('getUserById', "client not found in cache");
				User.findById(clientId, function(err, client) {
					if(err != null) {
						callback(err, null);
					} else {
						cache.set( client.id, client);
						callback(null, client);
					}
				});
			} else { 
				logger.audit('getUserById', "client found in cache");
				callback(null, client);
			}
		} else {			
			callback(err, null);
		}
	});
};

//If shouldAdd is true, we add this gameId to the list of ActiveGames, if false, remove
module.exports.updateActiveGames = function( clientId , gameId, shouldAdd, callback ) {
	if(shouldAdd) {
		User.findByIdAndUpdate(clientId,{ $addToSet: { activeGames: [ gameId ] } }, {new:true} , function(err, client) {
			if(err != null) {
				callback(err, null);
			} else {
				cache.set( client.id, client);
				callback(null, client);
			}
		});
		User.findByIdAndUpdate(clientId,{ $pull: { activeGames: gameId } }, {new:true} , function(err, client) {
			if(err != null) {
				callback(err, null);
			} else {
				cache.set( client.id, client);
				callback(null, client);
			}
		});
	}
};

//If shouldAdd is true, we add this leagueId to the list of leagues, if false, remove
module.exports.updateLeagues = function( clientId , leagueId, shouldAdd, callback ) {
	if(shouldAdd) {
		User.findByIdAndUpdate(clientId,{ $addToSet: { leagues: [ leagueId ] } }, {new: true}, function(err, client) {
			if(err != null) {
				callback(err, null);
			} else {
				cache.set( client.id, client);
				callback(null, client);
			}
		});
	} else {
		User.findByIdAndUpdate(clientId,{ $pull: { leagues: leagueId } }, {new: true} , callback, function(err, client) {
			if(err != null) {
				callback(err, null);
			} else {
				cache.set( client.id, client);
				callback(null, client);
			}
		});
	}

};

module.exports.getUserByName = function(userName, callback) {
	User.findOne({name : userName}, callback).select("-password");
};

module.exports.getUserByEmail = function(email, callback) {
	User.findOne({email : email}, callback).select("+password");
};

module.exports.authenticateUser = function(email, password, callback) {
	User.findOne({email : email, password: password}, callback).select("-password");
};

module.exports.updateUser = function(userId, params, callback) {
	User.findByIdAndUpdate(userId,  { $set: params}, {new:true}, callback);
};
