
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Constants = require('../utils/Constants.js');


var UserSchema   = new Schema({
    name: {type : String, required : true, unique: true },
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
  user.attending = 0 ;

  user.save(callback);
};

module.exports.getUsersListById = function(listOfClientIds, callback) {
  User.find({
    '_id': { $in: listOfClientIds}
      }, function(err, docs) {
          if(err != null) {
              callback(err, null);
          } else {
            callback(null, docs);
          }
      });
}

module.exports.getUserById = function( clientId , callback ) {
  User.findById(clientId, callback);
};

// If shouldAdd is true, we add this gameId to the list of ActiveGames, if false, remove
module.exports.updateActiveGames = function( clientId , gameId, shouldAdd, callback ) {
  if(shouldAdd) {
    User.findByIdAndUpdate(clientId,{ $addToSet: { activeGames: [ gameId ] } }, {new:true} , callback);
  } else {
    User.findByIdAndUpdate(clientId,{ $pull: { activeGames: gameId } }, {new:true} , callback);
  }
};

// If shouldAdd is true, we add this leagueId to the list of leagues, if false, remove
module.exports.updateLeagues = function( clientId , leagueId, shouldAdd, callback ) {
  if(shouldAdd) {
    User.findByIdAndUpdate(clientId,{ $addToSet: { leagues: [ leagueId ] } }, {new:true} , callback);
  } else {
    User.findByIdAndUpdate(clientId,{ $pull: { leagues: leagueId } }, {new:true} , callback);
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
