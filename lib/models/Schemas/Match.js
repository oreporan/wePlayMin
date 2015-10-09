// Match
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var MatchSchema   = new Schema({
    gameId : {type : String, required: true},
    matchDay : {type : Date, required : true}
    });

var Match = mongoose.model('Match', MatchSchema);
module.exports.Match = Match;

// Finds all the matches in the DB from now
module.exports.getMatches = function(callback) {
  Match.find({matchDay : {'$gte' : Date()}}, function(err, result){
    if(err != null) {
      // Problem getting matches
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports.createMatch = function(gameId, matchDay, callback) {
  var match = new Match();
  match.gameId = gameId;
  match.matchDay = matchDay;
  match.save(callback);
};

module.exports.destroyMatch = function(matchId, callback) {
  Match.findOneAndRemove(matchId, callback);
};

module.exports.getMatchById = function(matchId, callback) {
  Match.findById(matchId, {upsert : true} ,callback);
};
