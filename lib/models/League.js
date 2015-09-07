var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Constants = require('../utils/Constants.js');

//League
var LeagueSchema   = new Schema({
	name: {type : String, required : true, unique: true },
	users: [String],
	admin : {type : String, required : true },
	dateCreated: { type: Date, default: Date.now },
	startDate: { type: Date, default: Date.now },
	endDate: {type: Date, default: Date.now},
	frequency : {type: Number, required: true, default : Constants.GAME_FREQUENCY_NEVER},
	games: [String]

});

var League = mongoose.model('League', LeagueSchema);
module.exports.League = League;

module.exports.addLeague = function(name, admin, frequency, games, users, callback) {
	var league = new League();      // create a new instance of the League model
	league.name = name;
	league.admin = admin;
	league.frequency = frequency;
	league.games = games;
	league.users = users;
	league.save(callback);
};

module.exports.getLeagueByName = function(leagueName, callback) {
	League.findOne({name : leagueName}, callback);
};

module.exports.getLeagueById = function(leagueId, callback) {
	League.findOne(leagueId, callback);
};

module.exports.addUserToLeague = function(clientId, leagueId, callback) {
	League.update({_id : leagueId}, { $addToSet: {users: [ clientId ] } },callback);
};

module.exports.removeUserFromLeague = function(clientId, leagueId, callback) {
	League.update({_id : leagueId}, { $pull: { users: clientId } }, callback);
};


module.exports.getAllUserLeagues = function(clientId, callback) {
	League.find({ users: { $all: [ clientId ] } }, callback);
};

module.exports.updateLeague = function(leagueId, params, callback) {
	League.update({ _id: leagueId},  { $set: params}, callback);
};
