angular.module('app.services')
  .service('gameService', function(logger, localStorageService, userService, wpRequest, paths, constants) {

    var wpLogger = logger.logger("gameService");

    return {
      addGame: function(leagueId, matchDay, users, callback) {
        var clientId = localStorageService.getClientId();
        wpRequest.sendPostWithHeaders(paths.BASE_GAME + paths.PATH_GAME_ADDGAME, {
          matchDay: matchDay,
          users: users
        }, {
          "client-id": clientId,
          "league-id": leagueId
        }, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("addGame", "response: " + response);
            callback(response);
          }
        })
      },

      toggleAttending: function(leagueId, gameId, attending, callback) {
        sendGetWithGameHeaders(paths.PATH_GAME_ATTENDINGSTATUS_WITH_GAMEID + '/' + gameId + '/' + attending, leagueId, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("toggleAttending", "response: " + response);
            callback(response);
          }
        })
      },

      buildGame: function(leagueId, gameId, attending, callback) {
        sendGetWithGameHeaders(paths.PATH_GAME_BUILDGAME_WITH_ID + '/' + gameId, leagueId, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("buildGame", "response: " + response);
            callback(response);
          }
        })
      },

      getGameById: function(gameId, callback) {
        wpRequest.sendGet(paths.BASE_GAME + paths.PATH_GAME_GETGAME_WITH_ID + '/' + gameId, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("getGameById", "response: " + response);
            callback(response);
          }
        })
      },

      changeGameStatus: function(gameId, shouldCloseGame, callback) {
        wpRequest.sendPostWithHeaders(paths.BASE_GAME + paths.PATH_GAME_CHANGEGAMESTATUS_WITH_ID + '/' + gameId, {
          shouldCloseGame: shouldCloseGame,
        }, {
          "client-id": clientId,
          "league-id": leagueId
        }, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("changeGameStatus", "response: " + response);
            callback(response);
          }
        })
      },

      getGamesListById: function(games, callback) {
        wpRequest.sendPost(paths.BASE_GAME + paths.PATH_GAME_GETGAMELIST, {
          games: games
        }, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("getLeaguesListById", "response: " + response);
            callback(response);
          }
        })
      },

      updateGame: function(gameId, params, callback) {
        wpRequest.sendPut(paths.BASE_GAME + paths.PATH_GAME_UPDATEGAME, params, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("updateLeague", "response: " + response);
            callback(response);
          }
        })
      }
    }
  });



// .service('gameService', ['$http', '$state', function($http) {
//
//   return {
//     getGameById: function(clientId, leagueId, gameId, success, fail) {
//       var req = {
//         method: 'GET',
//         url: 'http://localhost:3000/wePlay/v1/leagues/getGame/' + gameId,
//         headers: {
//           'Content-Type': 'application/json',
//           'client-id': clientId,
//           'leagues-id': leagueId
//         }
//       }
//       return $http(req).then(success, fail);
//     },
//     createGame: function(clientId, leagueId, matchDay, success, fail) {
//       var req = {
//         method: 'POST',
//         url: 'http://localhost:3000/wePlay/v1/leagues/addGame',
//         headers: {
//           'Content-Type': 'application/json',
//           'client-id': clientId,
//           'leagues-id': leagueId
//         },
//         data: {
//           'matchDay': matchDay
//         }
//       };
//       $http(req).then(success, fail);
//     }
//   }
//
// }]);
