// Game
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema   = new Schema({
    leagueId : {type : String, required: true},
    users : [String],
    matchDay : {type : Date, required : true},
    dateCreated: { type: Date, default: Date.now },
    closed : {type : Boolean, default : false},
    matchId : String,
    teamA : [String],
    teamB : [String],
    invites : [String]
});

var Game = mongoose.model('Game', GameSchema);
module.exports.Game = Game;

module.exports.addGame = function(leagueId, matchDay, clientId, callback) {
  var game = new Game();
  game.leagueId = leagueId;
  game.users = [clientId];
  game.matchDay = matchDay;
  game.save(function(err, result) {
    if(err != null) {
      callback(err, null);
    } else {
      // Success in creating the game
      callback(null, result);
    }
  });
};

module.exports.closeGame = function(gameId, callback) {
  Game.findByIdAndUpdate(gameId, {$set : {closed : true}}, {new : true} , callback);
};

module.exports.linkMatchToGame = function(matchId, gameId) {
  Game.findByIdAndUpdate(gameId, {$set : {matchId : matchId}});
};

module.exports.getGamesListById = function(listOfGamesIds, callback) {
  Game.find({
    '_id': { $in: listOfGamesIds}, matchDay : {'$gte' : Date()}
      }, function(err, docs) {
          if(err != null) {
              callback(err, null);
          } else {
            var res = docs;
            if(docs.length == 1 ) {
              res = docs[0];
            }
                callback(null, res);
          }
      });
}

module.exports.addUserToGame = function(gameId, clientId, callback) {
  Game.findOneAndUpdate({ _id: gameId, closed: false}, { $addToSet: {users: [ clientId ] } }, {new:true}, callback);
};

module.exports.updateGame = function(gameId, params, callback) {
	Game.findByIdAndUpdate(gameId,  { $set: params}, {new:true}, callback);
};

module.exports.removeUserFromGame = function(gameId, clientId, callback) {
  Game.findByIdAndUpdate(gameId,{ $pull: { users: clientId } }, {new:true}, callback);
};
