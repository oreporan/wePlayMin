// Managers the Matches model, sets off cron jobs on matches.
var logger = require('../../framework/logger').init('matches');
var Match = require('../Schemas/Match');
var taskManager = require('../../framework/wpTaskManager');
var games = require('../../controllers/games');

// Sets off all the matches cron jobs
module.exports.initMatches = function() {
  Match.initMatches(function(err, result) {
    if(err != null) {
      logger.error('initMatches' , 'could not start cron jobs for matches, reason: ' + err);
    } else {
      logger.audit('initMatches', 'initalizing all ' +result.length+ ' matches');
      for(var i = 0 ; i < result.length ; i++) {
      taskManager.createTask(result[i].matchDay, onMatchReady, result[i]);
      }
    }
  })
};

module.exports.createMatch = function( gameId, matchDay,  callback ) {
  Match.createMatch(gameId, matchDay, function(err, result) {
    if(err != null) {
      logger.error('createMatch' , 'could not start create match , reason: ' + err);
      callback(null, result);
    } else {
      logger.audit('createMatch', 'match created with id: ' + result._id + ', for game : ' + result.gameId);
      taskManager.createTask(result.matchDay, onMatchReady, {match : result});
      callback(null, result);
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
        callback(null, result);
      }
    }
  });
}

/* Starts a match */
module.exports.startMatch = function(matchId, callback) {
  Match.getMatchById(matchId, function(err, result) {
    onMatchReady({match : result, callback : callback});
  })
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
