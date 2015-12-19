//Match
var mongoose     = require('mongoose');
var Schema = mongoose.Schema;
var cache = require('../../../framework/wpCache');
var logger = require('../../../utils/logger').init('User');


var MatchSchema   = new Schema({
	gameId : {type : String, required: true},
	matchDay : {type : Date, required : true}
});

var Match = mongoose.model('Match', MatchSchema);
module.exports.Match = Match;

//Finds all the matches in the DB from now
module.exports.getMatches = function(callback) {
	Match.find({matchDay : {'$gte' : Date()}}, function(err, match){
		if(err != null) {
			return callback(err, null);
		}

		if(match != null){
			cache.setById( match.id, match);
			return callback(null, match);
		}

		return callback(null, null);
	});
};

module.exports.createMatch = function(gameId, matchDay, callback) {
	var match = new Match();
	match.gameId = gameId;
	match.matchDay = matchDay;
	match.save(function(err, result) {
		if(err != null) {
			callback(err, null);
		} else {
			// Success in creating the game
			cache.setById( match._id, match);	
			callback(null, result);
		}
	});
};

module.exports.destroyMatch = function(matchId, callback) {
	Match.findOneAndRemove(matchId, callback);
};

module.exports.getMatchById = function(matchId, callback) {
	Match.findById(matchId, function(err, match){
		if(err != null) {
			return callback(err, null);
		}

		if(match != null){
			cache.setById( match.id, match);
			return callback(null, match);
		}

		return callback(null, null);
	});
};
