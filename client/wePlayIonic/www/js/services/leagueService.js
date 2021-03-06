angular.module('app.services')
  .service('leagueService', function(logger, localStorageService, userService, wpRequest, paths, constants) {

    var wpLogger = logger.logger("leagueService");
    var selectedLeague = {};

    return {
      addLeague: function(name, admin, frequency, numOfPlayersPerTeam, makeTeamsAtNum, callback) {
        wpRequest.sendPost(paths.BASE_LEAGUES + paths.PATH_LEAGUES_ADDLEAGUE, {
          name: name,
          admin: admin,
          frequency: frequency,
          numOfPlayersPerTeam: numOfPlayersPerTeam,
          makeTeamsAtNum: makeTeamsAtNum
        }, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("addLeague", "response: " + response);
            callback(response);
          }
        })
      },

      getLeagueById: function(leagueId, callback) {
        wpRequest.sendGet(paths.BASE_LEAGUES + paths.PATH_LEAGUES_GETLEAGUEBYID + '/' + leagueId, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("getLeagueById", "response: " + response);
            callback(response);
          }
        })
      },

      getLeagueByName: function(name, callback) {
        wpRequest.sendGet(paths.BASE_LEAGUES + paths.PATH_LEAGUES_GETLEAGUEBYNAME + '/' + name, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("getLeagueByName", "response: " + response);
            callback(response);
          }
        })
      },

      getLeagueByKeyword: function(keyword, callback) {
        wpRequest.sendGet(paths.BASE_LEAGUES + paths.PATH_LEAGUES_GETLEAGUESBYKEYWORD + '/' + keyword, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("getLeagueByKeyword", "response: " + response);
            callback(response);
          }
        })
      },

      addUserToLeague: function(leagueId, callback) {
        wpRequest.sendPut(paths.BASE_LEAGUES + paths.PATH_LEAGUES_ADDUSERTOLEAGUE + "/", leagueId, {
          isInvite: false
        }, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("addUserToLeague", "response: " + response);
            callback(response);
          }
        })
      },

      removeUserFromLeague: function(leagueId, callback) {
        wpRequest.sendPut(paths.BASE_LEAGUES + paths.PATH_LEAGUES_REMOVEUSERFROMLEAGUE_WITH_ID + '/' + leagueId, function(response, error) {
          if (err) {
            callback(null, err);

          } else {
            wpLogger.audit("removeUserFromLeague", "response: " + response);
            callback(response);
          }
        })
      },

      getLeaguesListById: function(leagueIds, callback) {
        wpRequest.sendPost(paths.BASE_LEAGUES + paths.PATH_LEAGUES_GETLEAGUESLIST_BY_ID, {
          leagueIds: leagueIds
        }, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("getLeaguesListById", "response: " + response);
            callback(response);
          }
        })
      },

      updateLeague: function(adminId, leagueId, callback) {
        wpRequest.sendPut(paths.BASE_LEAGUES + paths.PATH_LEAGUES_UPDATELEAGUE, leagueId, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("updateLeague", "response: " + response);
            callback(response);
          }
        })
      },

      addAdmin: function(leagueId, admin, callback) {
        wpRequest.sendPut(paths.BASE_LEAGUES + paths.PATH_LEAGUES_ADD_ADMIN_WITH_LEAGUE_ID + "/" + leagueId, {
          admin: admin
        }, function(response, error) {
          if (error) {
            callback(null, error);
          } else {
            wpLogger.audit("addAdmin", "response: " + response);
            callback(response);
          }
        })
      },
      setSelectedLeague: function(selectedLeague) {
        this.selectedLeague = selectedLeague;
      },
      getSelectedLeague: function() {
        return this.selectedLeague;
      }
    }
  });
