angular.module('app.services')
  .service('gameService', function(logger, localStorageService, userService, wpRequest, paths, constants) {

    var wpLogger = logger.logger("gameService");

    return {
      addGame: function(leagueId, matchDay, users, callback) {
        var clientId = localStorageService.getByKey(constants.STORAGE_CLIENTID);
        wpRequest.sendPostWithHeaders(paths.BASE_GAME + paths.PATH_GAME_ADDGAME, {
          matchDay: matchDay,
          users: users
        }, {
          "client-id": clientId,
          "league-id": leagueId
        }, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("addGame", "response: " + response);
            callback(response);
          }
        })
      },

      toggleAttending: function(leagueId, gameId, attending, callback) {
        wpRequest.sendGetWithHeaders(paths.BASE_GAME + paths.PATH_GAME_ATTENDINGSTATUS_WITH_GAMEID + '/' + gameId + '/' + attending, leagueId, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("toggleAttending", "response: " + response);
            callback(response);
          }
        })
      },

      getLeagueByName: function(name, callback) {
        wpRequest.sendGet(paths.BASE_GAME + paths.PATH_LEAGUES_GETLEAGUEBYNAME, name, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("getLeagueByName", "response: " + response);
            callback(response);
          }
        })
      },

      getLeagueByKeyword: function(keyword, callback) {
        wpRequest.sendGet(paths.BASE_GAME + paths.PATH_LEAGUES_GETLEAGUESBYKEYWORD, keyword, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("getLeagueByKeyword", "response: " + response);
            callback(response);
          }
        })
      },

      addUserToLeague: function(leagueId, callback) {
        wpRequest.sendGet(paths.BASE_GAME + paths.PATH_LEAGUES_ADDUSERTOLEAGUE, leagueId, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("addUserToLeague", "response: " + response);
            callback(response);
          }
        })
      },

      removeUserFromLeague: function(leagueId, callback) {
        wpRequest.sendGet(paths.BASE_GAME + paths.PATH_LEAGUES_REMOVEUSERFROMLEAGUE_WITH_ID, leagueId, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("removeUserFromLeague", "response: " + response);
            callback(response);
          }
        })
      },

      getLeaguesListById: function(leagueIds, callback) {
        wpRequest.sendPost(paths.BASE_GAME + paths.PATH_LEAGUES_GETLEAGUESLIST_BY_ID, leagueIds, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("getLeaguesListById", "response: " + response);
            callback(response);
          }
        })
      },

      updateLeague: function(adminId, leagueId, callback) {
        wpRequest.sendPut(paths.BASE_GAME + paths.PATH_LEAGUES_UPDATELEAGUE, leagueId, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("updateLeague", "response: " + response);
            callback(response);
          }
        })
      },

      addAdmin: function(leagueId, admin, callback) {
        wpRequest.sendPut(paths.BASE_GAME + paths.PATH_LEAGUES_ADD_ADMIN_WITH_LEAGUE_ID + "/" + leagueId, {
          admin: admin
        }, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("addAdmin", "response: " + response);
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
//           'league-id': leagueId
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
//           'league-id': leagueId
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
