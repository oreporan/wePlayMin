// Game
var mongoose     = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Schema = mongoose.Schema;

var GameSchema   = new Schema({
    leagueId : {type : String, required: true},
    users : [Schema.Types.Mixed],
    matchDay : {type : Date, required : true},
    dateCreated: { type: Date, default: Date.now },
    closed : {type : Boolean, default : false},
    matchId : String,
    makeTeamsAtNum : Number,
    numOfPlayersPerTeam : Number,
    teamA : [String],
    teamB : [String],
    invites : [String]
});

var Game = mongoose.model('Game', GameSchema);
module.exports.Game = Game;

module.exports.addGame = function(leagueId, matchDay, clientId, users, numOfPlayersPerTeam, makeTeamsAtNum, callback) {
  var game = new Game();
  game.leagueId = leagueId;
  game.users = users;
  game.matchDay = matchDay;
  game.makeTeamsAtNum = makeTeamsAtNum;
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

module.exports.closeGame = function(gameId, callback) {
  Game.findOneAndUpdate({'_id' : gameId, closed : false}, {$set : {closed : true}}, {new : true} , callback);
};

module.exports.openGame = function(gameId, callback) {
  Game.findOneAndUpdate({'_id' : gameId, closed : true}, {$set : {closed : false}}, {new : true} , callback);
};

module.exports.linkMatchToGame = function(matchId, gameId) {
  Game.findByIdAndUpdate(gameId, {$set : {matchId : matchId}});
};

module.exports.getGamesListById = function(listOfGamesIds, callback) {
  Game.find({
    '_id': { $in: listOfGamesIds}
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

module.exports.updateGameAttendingStatus = function(gameId, clientId, attendingStatus, callback) {
  Game.findOneAndUpdate({ _id: gameId, closed: false, 'users._id' : new ObjectId(clientId)}, {$set : { 'users.$.attending' : attendingStatus, 'users.$.date' : Date() }}, {new:true}, callback);

}

module.exports.addUserToGame = function(gameId, gameUser, callback) {
  Game.findOneAndUpdate({ _id: gameId, closed: false}, { $addToSet: {users:  gameUser  } }, {new:true}, callback);
};

module.exports.updateGame = function(gameId, params, callback) {
	Game.findByIdAndUpdate(gameId,  { $set: params}, {new:true}, callback);
};

module.exports.removeUserFromGame = function(gameId, gameUser, callback) {
  Game.findByIdAndUpdate(gameId,{ $pull: { users: clientId } }, {new:true}, callback);
};
