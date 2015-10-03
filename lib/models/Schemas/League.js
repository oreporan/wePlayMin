var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Constants = require('../../utils/Constants.js');

//League
var LeagueSchema   = new Schema({
	name: {type : String, required : true, unique: true },
	users: [String],
	admin : {type : String, required : true },
	dateCreated: { type: Date, default: Date.now },
	startDate: { type: Date, default: Date.now },
	endDate: {type: Date, default: Date.now},
	numOfPlayersPerTeam : {type : Number, required : true },
	frequency : {type: Number, required: true, default : Constants.GAME_FREQUENCY_NEVER},
	makeTeamsAtNum : {type : Number , required : true },
	games: [String]

});

var League = mongoose.model('League', LeagueSchema);
module.exports.League = League;

module.exports.addLeague = function(name, admin, frequency, games, users, numOfPlayersPerTeam, makeTeamsAtNum , callback) {
	var league = new League();      // create a new instance of the League model
	league.name = name;
	league.admin = admin;
	league.frequency = frequency;
	league.games = games;
	league.users = users;
	league.numOfPlayersPerTeam = numOfPlayersPerTeam;
	league.makeTeamsAtNum = makeTeamsAtNum == null ? numOfPlayersPerTeam * 2 + 2  : makeTeamsAtNum;
	league.save(callback);
};

module.exports.getLeagueByGameId = function(gameId, callback) {
	League.findOne({games : {'$in' : [gameId]}}, callback);
};

module.exports.getLeagueByName = function(leagueName, callback) {
	League.findOne({name : leagueName}, callback);
};

module.exports.getLeagueById = function(leagueId, callback) {
	League.findOne(leagueId, callback);
};

module.exports.addUserToLeague = function(clientId, leagueId, callback) {
	League.findByIdAndUpdate(leagueId, { $addToSet: {users: [ clientId ] } }, {new:true},callback);
};

module.exports.addGameToLeague = function(leagueId, gameId, callback) {
	League.findByIdAndUpdate(leagueId, { $addToSet: {games: [ gameId ] } }, {new:true},callback);
};

module.exports.removeUserFromLeague = function(clientId, leagueId, callback) {
	League.findByIdAndUpdate(leagueId, { $pull: { users: clientId } }, {new:true}, callback);
};


module.exports.getAllUserLeagues = function(listOfLeagues, callback) {
	League.find({
		'_id': { $in: listOfLeagues}
	}, callback);
};

module.exports.updateLeague = function(leagueId, params, callback) {
	League.findByIdAndUpdate(leagueId,  { $set: params}, {new:true}, callback);
};