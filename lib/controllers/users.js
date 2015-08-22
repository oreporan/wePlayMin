// Controller for Users
var User = require('../models/Schemas').User;
//Init the logger
var logger = require('../framework/logger').init('users');


module.exports.getUserById = function( clientId , callback ) {
	logger.audit('getUserById' , "Getting user: " + clientId);
	
	if(clientId == null) {
		callback(null, "no clientId");
		return;
	}
	
	User.findById(clientId , function(err, user) {
		if (err != null){
			callback(null , err);
			return;
		}
		if(user == null){
			callback(null , null);
			return;
		} else {
			callback(user, null);
		}
	});
};


module.exports.addUser = function(userName, league, callback ) {       
        var user = new User();      // create a new instance of the User model
        user.name = userName;
        user.leagues = (league == null ? [] : [league]);
        user.attending = 0 ;


        // save the user and check for errors
        user.save(function(err , clientId) {
            if(err) {
               callback(null , err);
            } 
            // User was saved
            callback(clientId , null);
        });
        
    };