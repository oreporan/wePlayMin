angular.module('app.services')
  .service('leagueService', function(logger, localStorageService, userService, wpRequest, paths, constants) {

      var wpLogger = logger.logger("leagueService");

      var addLeague = function(name, admin, frequency, numOfPlayersPerTeam, makeTeamsAtNum, callback) {
        wpRequest.sendPost(paths.BASE_LEAGUES + paths.PATH_LEAGUES_ADDLEAGUE, {
          name: name,
          admin: admin,
          frequency: frequency,
          numOfPlayersPerTeam: numOfPlayersPerTeam,
          makeTeamsAtNum: makeTeamsAtNum
        }, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("addLeague", "response: " + response);
            callback(response);
          }
        })
      };

      var getLeagueById = function(leagueId, callback) {
        wpRequest.sendGet(paths.BASE_LEAGUES + paths.PATH_LEAGUES_GETLEAGUEBYID, leagueId, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("getLeagueById", "response: " + response);
            callback(response);
          }
        })
      };

      var getLeagueByName = function(name, callback) {
        wpRequest.sendGet(paths.BASE_LEAGUES + paths.PATH_LEAGUES_GETLEAGUEBYNAME, name, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("getLeagueByName", "response: " + response);
            callback(response);
          }
        })
      };

      var getLeagueByKeyword = function(keyword, callback) {
        wpRequest.sendGet(paths.BASE_LEAGUES + paths.PATH_LEAGUES_GETLEAGUESBYKEYWORD, keyword, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("getLeagueByKeyword", "response: " + response);
            callback(response);
          }
        })
      };

      var addUserToLeague = function(leagueId, callback) {
        wpRequest.sendGet(paths.BASE_LEAGUES + paths.PATH_LEAGUES_ADDUSERTOLEAGUE, leagueId, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("addUserToLeague", "response: " + response);
            callback(response);
          }
        })
      };

      var removeUserFromLeague = function(leagueId, callback) {
        wpRequest.sendGet(paths.BASE_LEAGUES + paths.PATH_LEAGUES_REMOVEUSERFROMLEAGUE_WITH_ID, leagueId, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("removeUserFromLeague", "response: " + response);
            callback(response);
          }
        })
      };

      var getLeaguesListById = function(leagueIds, callback) {
        wpRequest.sendPost(paths.BASE_LEAGUES + paths.PATH_LEAGUES_GETLEAGUESLIST_BY_ID, leagueIds, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("getLeaguesListById", "response: " + response);
            callback(response);
          }
        })
      };

      var updateLeague = function(adminId, leagueId, callback) {
        wpRequest.sendPut(paths.BASE_LEAGUES + paths.PATH_LEAGUES_UPDATELEAGUE, leagueId, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("updateLeague", "response: " + response);
            callback(response);
          }
        })
      };

      var addAdmin = function(leagueId, admin, callback) {
        wpRequest.sendPut(paths.BASE_LEAGUES + paths.PATH_LEAGUES_ADD_ADMIN_WITH_LEAGUE_ID + "/" + leagueId, {
          admin: admin
        }, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit("addAdmin", "response: " + response);
            callback(response);
          }
        })
      };



      // .service('leagueService',['$http', '$state', function($http) {
      //
      //     return {
      //         getLeagueById: function(clientId, leagueId, success, fail) {
      //             var req = {
      //                 method: 'GET',
      //                 url: 'http://localhost:3000/wePlay/v1/leagues/getLeague/' + leagueId,
      //                 headers: {
      //                     'Content-Type': 'application/json',
      //                     'client-id': clientId
      //                 }
      //             }
      //             return $http(req).then(success, fail);
      //         },
      //         createLeague: function(clientId, params, success, fail){
      //             var req = {
      //                 method: 'POST',
      //                 url: 'http://localhost:3000/wePlay/v1/leagues/addLeague/',
      //                 headers: {
      //                     'Content-Type': 'application/json',
      //                     'client-id': clientId
      //                 },
      //                 data: {
      //                     name: params.name,
      //                     numOfPlayersPerTeam: params.numOfPlayersPerTeam,
      //                     admin: clientId,
      //                     frequency: params.frequency,
      //                     makeTeamsAtNum: params.makeTeamsAtNum
      //                 }
      //             };
      //             return $http(req).then(success, fail);
      //         }
      //     }
      // }]);
