// Managers the Matches model, sets off cron jobs on matches.
var logger = require('../../utils/logger').init('matches');
var Match = require('../Schemas/Match');
var taskManager = require('../../framework/wpTaskManager');
var games = require('../../controllers/games');


// Variables
var matchWarmUpTimeInHours = 3;

// Sets off all the matches cron jobs
module.exports.initMatches = function() {
  Match.getMatches(function(err, result) {
    if(err != null) {
      logger.error('initMatches' , 'could not start cron jobs for matches, reason: ' + err);
    } else {
      logger.audit('initMatches', 'initalizing all ' +result.length+ ' matches');
      for(var i = 0 ; i < result.length ; i++) {
      startCrons(result[i]);
      }
    }
  })
};

module.exports.createMatch = function( gameId, matchDay,  callback ) {
  Match.createMatch(gameId, matchDay, function(err, result) {
    if(err != null) {
      logger.error('createMatch' , 'could not start create match , reason: ' + err);
      return callback(null, result);
    } else {
      logger.audit('createMatch', 'match created with id: ' + result._id + ', for game : ' + result.gameId);
      startCrons(result);
      return callback(null, result);
    }
  });
};

function destroyMatch(matchId, callback) {
  Match.destroyMatch(matchId, function(err, result) {
    if(callback) {
      if(err != null) {
        logger.warn('destroyMatch', 'problem removing match from Match collection');
        callback(err, null);
      } else {
        logger.audit('destroyMatch', ' match linked with gameId' + result.gameId + ' destroyed');
        callback(null, result);
      }
    }
  });
}

function startCrons (matchObj) {
  // We start two cronjobs per match, one X hours before, one at game time

  //var warmUpTime = wpDate.dateAdd(result.matchDay, 'hour', - matchWarmUpTimeInHours);
  //taskManager.createTask(warmUpTime, onMatchWarmUp, {match : matchObj});

  // gametime cron
//  taskManager.createTask(matchObj.matchDay, onMatchReady, {match : matchObj});
}

// called X hours before a game has started
function onMatchWarmUp ( options ) {
  var gameId = options.match.gameId;
  var optionsCallback = options.match.callback;
  logger.audit('onMatchWarmUp', 'game : ' + gameId + ', is ready for warmup, ' + matchWarmUpTimeInHours + ' hours before match');
  games.warmUpGame(options.match, optionsCallback);
}

// This function fires whenever a match has reached its time
function onMatchReady( options ) {
  var gameId = options.match.gameId;
  var optionsCallback = options.callback;
  // First - destroy the match
  destroyMatch(gameId);
  logger.audit('onMatchReady', 'game : ' + gameId + ', is ready to be played');
  // Fire game builder
  games.playGame(options.match, optionsCallback);
}

module.exports.destroyMatch = destroyMatch;
