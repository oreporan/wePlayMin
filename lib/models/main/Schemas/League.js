var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var Constants = require('../../../utils/Constants.js');
var ObjectId = require('mongoose').Types.ObjectId;
var cache = require('../../../framework/wpCache');

//League
var LeagueSchema   = new Schema({
	name: {type : String, required : true, unique: true , index: true},
	users: [Schema.Types.Mixed],
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
			return callback(err, null);
		}

		if(league != null){
			cache.setById( league.id, league);
			return callback(null, league);
		}

		return callback(null, null);
	});
};

module.exports.getLeagueByName = function(leagueName, callback) {
	League.findOne({name : leagueName}, function(err, league) {
		if(err != null) {
			return callback(err, null);
		}

		if(league != null){
			cache.setById( league.id, league);
			return callback(null, league);
		}

		return callback("League does not exist", null);
	});
};

module.exports.getLeaguesListSearchQuery = function(leagueName, callback) {
	var regex = new RegExp(leagueName, "i")
	League.find({name : regex}, function(err, leagues) {
		if(err != null) {
			return callback(err, null);
		}

		if(leagues != null && leagues.length > 0){
			return callback(null, leagues);
		}

		return callback("No leagues have contain this keyword", null);
	}).limit(20);
};

module.exports.getLeagueById = function(leagueId, callback) {
	cache.getById(leagueId , function( err, league ) {
		if( !err ) {
			League.findById(leagueId, function(err, league) {
				if(err != null) {
					return callback(err, null);
				}

				if(league != null){
					cache.setById( league.id, league);
					return callback(null, league);
				}

				return callback(null, null);
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
			return callback(err, null);
		}

		if(league != null){
			cache.setById( league.id, league);
			return callback(null, league);
		}

		return callback("User is already in league", null);
	});
};

module.exports.addGameToLeague = function(leagueId, gameId, callback) {
	League.findByIdAndUpdate(leagueId, { $addToSet: {games:  gameId  } }, {new:true}, function(err, league) {
		if(err != null) {
			return callback(err, null);
		}

		if(league != null){
			cache.setById( league.id, league);
			return callback(null, league);
		}

		return callback(null, null);
	});
};

module.exports.removeUserFromLeague = function(clientId, leagueId, callback) {
	console.log(clientId + ' and ' + leagueId);
	League.findByIdAndUpdate(new ObjectId(leagueId), { '$pull': { 'users': {'_id' : clientId}}, 'admins' : clientId }, {multi: true, new:true}, function(err, league) {
		if(err != null) {
			return callback(err, null);
		}

		if(league != null){
			cache.setById( league.id, league);
			return callback(null, league);
		}

		return callback(null, null);
	});
};


module.exports.getAllUserLeagues = function(listOfLeagues, callback) {
	cache.getMultyObjectsByIDsArray( listOfLeagues, function( err, leagues ){
		if( !err ){
			League.find({'_id': { $in: listOfLeagues} }, function(err, result) {
				if(err != null) {
					logger.test('getAllUserLeagues', "failed to find, error: " + err);
					return callback(err, null);
				}

				if(result != null){
					var jsonResult = {};
					// Cache keys
					for(var i = 0; i < result.length; i++){
						cache.setById(result[i]._id, result[i]);
						jsonResult[result[i]._id] = result[i];
					}
					return callback(null, jsonResult);
				}

				return callback(null, null);
			});
		} else {
			callback(null, leagues);
		}
	});
};

module.exports.updateLeague = function(leagueId, params, callback) {
	League.findByIdAndUpdate(leagueId,  { $set: params}, {new:true}, function(err, league) {
		if(err != null) {
			return callback(err, null);
		}

		if(league != null){
			cache.setById( league.id, league);
			return callback(null, league);
		}

		return callback(null, null);
	});
};
