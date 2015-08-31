// Controller for leagues

// Init the logger
var logger = require('../framework/logger').init('leagues');
var League = require('../models/Schemas').League;

module.exports.addLeague = function(name, admin, frequency, games, users, callback) {
  var league = new League();      // create a new instance of the League model
  league.name = name;
  league.admin = admin;
  league.frequency = frequency;
  league.games = games;
  league.users = users;
  // save the user and check for errors
  league.save(function(err , result) {
    if(err) {
      callback(null , err);
    }
    // User was saved
    callback(result , null);
  });
};
