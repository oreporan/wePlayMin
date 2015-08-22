// Controller for Users
var User = require('../models/Schemas').User;


 module.exports.getUserById = function( clientId , callback ) {
        User.findById(clientId , function(err, user) {
            if (err){
               callback(null , messages.dbErrorMessage(err.message, err.errors));
            }
            if(user == null){
               callback(null , messages.dbErrorMessage("No User exists in the Database", "User: " + req.params.user_id + ", does not exist in the database"));
            } else {
                callback(user, null);
            }
        });
 };


module.exports.addUser = function( callback ) {       
        var user = new User();      // create a new instance of the User model
        user.name = req.body.name;
        user._id = req.body._id;
        user.leagues = req.body.leagues;
        user.attending = (req.body.attending != null) ? req.body.attending : 0 ;


        // save the user and check for errors
        user.save(function(err , clientId) {
            if(err) {
               callback(null , messages.dbErrorMessage(err.message, err.errors));
            } 
            // User was saved
            callback(messages.dBUserSavedMessage( clientId ) , null);
        });
        
    };