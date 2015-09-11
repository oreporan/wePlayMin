// Game
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema   = new Schema({
    leagueId : {type : String, required: true},
    users : [String],
    numOfPlayersPerTeam : Number,
    matchDay : {type : Date, required : true},
    dateCreated: { type: Date, default: Date.now },
    teamA : [String],
    teamB : [String],
    invites : [String]
});

var Game = mongoose.model('Game', GameSchema);
module.exports.Game = Game;

module.exports.addGame = function(leagueId, numOfPlayersPerTeam, matchDay, clientId, callback) {
  var game = new Game();
  game.leagueId = leagueId;
  game.users = [clientId];
  game.matchDay = matchDay;
  game.numOfPlayersPerTeam = numOfPlayersPerTeam;
  game.save(function(err, result) {
    if(err != null) {
      callback(err, null);
    } else {
      // Success in creating the game
      callback(null, result);
    }
  });
};

module.exports.addUserToGame = function(gameId, clientId, callback) {
  Game.findByIdAndUpdate(gameId, { $addToSet: {users: [ clientId ] } }, {new:true}, callback);
};

module.exports.removeUserFromGame = function(gameId, clientId, callback) {
  Game.findByIdAndUpdate(gameId,{ $pull: { users: clientId } }, {new:true}, callback);
};
