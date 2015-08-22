// Controller for Users
var User = require('../models/Schemas').User;


 module.exports.getUserById = function( clientId , callback ) {
        User.findById(clientId , function(err, user) {
            if (err){
               callback(null , err);
            }
            if(user == null){
               callback(null , null);
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