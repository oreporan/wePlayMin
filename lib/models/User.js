
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Constants = require('../utils/Constants.js');


var UserSchema   = new Schema({
    name: {type : String, required : true, unique: true },
    email : {type : String, required : true, unique: true},
    password : {type : String, required: true, select: false},
    leagues: [{ type: String, minlength : 3 }],
    dateCreated: { type: Date, default: Date.now },
    attending: { type: Number, min: -1, max: 1 , default : 0},
});

var User = mongoose.model('User', UserSchema);
module.exports.User = User;

module.exports.addUser = function(userName, email, password, callback) {
  var user = new User();      // create a new instance of the User model
  user.name = userName;
  user.password = password;
  user.leagues = [];
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

module.exports.getUserByName = function(userName, callback) {
  User.findOne({name : userName}, callback).select("-password");
};

module.exports.getUserByEmail = function(email, callback) {
  User.findOne({email : email}, callback).select("+password");
};

module.exports.authenticateUser = function(email, password, callback) {
  User.findOne({email : email, password: password}, callback).select("-password");
};
