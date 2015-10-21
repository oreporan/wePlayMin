var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Constants = require('../../../utils/Constants.js');
var ObjectId = require('mongoose').Types.ObjectId;
var cache = require('../../../framework/wpCache');

//League
var LeagueSchema   = new Schema({
	name: {type : String, required : true, unique: true },
	users: [Schema.Types.Mixed],
	invites: [String],
	admins: [String],
	creator : {type : String, required : true },
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

module.exports.addLeague = function(name, creator, admins, frequency, numOfPlayersPerTeam, makeTeamsAtNum , invites, callback) {
	var league = new League();      // create a new instance of the League model
	league.name = name;
	league.creator = creator;
	league.admins = admins;
	league.frequency = frequency;
	league.games = [];
	league.users = [];
	league.invites = invites;
	league.numOfPlayersPerTeam = numOfPlayersPerTeam;
	league.makeTeamsAtNum = makeTeamsAtNum == null ? numOfPlayersPerTeam * 2 + 2  : makeTeamsAtNum;
	league.save(function(err) {
		if(!err){
			cache.setById( league._id, league);	
			callback(null, league);
		} else {
			callback(err, null);
		}
	});
};

module.exports.getLeagueByGameId = function(gameId, callback) {
	League.findOne({games : {'$in' : [gameId]}}, function(err, league) {
		if(err != null) {
			callback(err, null);
		} else {
			cache.setById( league.id, league);
			callback(null, league);
		}
	});
};

module.exports.getLeagueByName = function(leagueName, callback) {
	League.findOne({name : leagueName}, function(err, league) {
		if(err != null) {
			callback(err, null);
		} else {
			cache.setById( league.id, league);
			callback(null, league);
		}
	});
};

module.exports.getLeagueById = function(leagueId, callback) {
	cache.getById(leagueId , function( err, league ) {
		if( !err ) {
			League.findById(leagueId, function(err, league) {
				if(err != null) {
					callback(err, null);
				} else {
					cache.setById( league.id, league);
					callback(null, league);
				}
			});
		} else { 
			callback(null, client);
		};
	});
};

module.exports.addUserToLeague = function(leagueUser, leagueId, callback) {
	var query = {'_id' : leagueId, 'users._id': { $ne: new ObjectId(leagueUser._id) }};
		League.findOneAndUpdate(query, { $addToSet: {users:  leagueUser  } }, {new:true}, function(err, league) {
		if(err != null) {
			callback(err, null);
		} else {
			cache.setById( league.id, league);
			callback(null, league);
		}
	});
};

module.exports.addGameToLeague = function(leagueId, gameId, callback) {
	League.findByIdAndUpdate(leagueId, { $addToSet: {games:  gameId  } }, {new:true}, function(err, league) {
		if(err != null) {
			callback(err, null);
		} else {
			cache.setById( league.id, league);
			callback(null, league);
		}
	});
};

module.exports.removeUserFromLeague = function(clientId, leagueId, callback) {
	League.findByIdAndUpdate(new ObjectId(leagueId), { '$pull': { users: {'_id' : new ObjectId(clientId)}, admins: clientId } }, {multi: true, new:true}, function(err, league) {
		if(err != null) {
			callback(err, null);
		} else {
			cache.setById( league.id, league);
			callback(null, league);
		}
	});
};


module.exports.getAllUserLeagues = function(listOfLeagues, callback) {
	cache.getMultyObjectsByIDsArray( listOfLeagues, function( err, leagues ){
		if( !err ){
			League.find({'_id': { $in: listOfLeagues} }, function(err, result) {
				if(err != null) {
					logger.error('getAllUserLeagues', "failed to find, error: " + err);
					callback(err, null);
				} else {
					var jsonResult = {};
					// Cache keys
					for(var i = 0; i < result.length; i++){
						cache.setById(result[i]._id, result[i]);
						jsonResult[result[i]._id] = result[i];
					}
					callback(null, jsonResult);
				}
			});
		} else {
			callback(null, leagues);
		}
	});	
};

module.exports.updateLeague = function(leagueId, params, callback) {
	League.findByIdAndUpdate(leagueId,  { $set: params}, {new:true}, function(err, league) {
		if(err != null) {
			callback(err, null);
		} else {
			cache.setById( league.id, league);
			callback(null, league);
		}
	});
};
