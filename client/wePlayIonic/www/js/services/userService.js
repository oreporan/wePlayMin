angular.module('app.services')
  .service('userService', function(localStorageService, logger, wpRequest, paths, constants) {

    var wpLogger = logger.logger("userService");
    wpLogger.audit("getWpUser", "Server url: " + JSON.stringify(paths.SERVER_URL));

    // Holds user's instance
    var user;

    var getWpUser = function(clientId, callback) {
      if (user != null) {
        wpLogger.audit("getWpUser", "user already exist in app. user: " + user);
        callback(user);
      } else {
        wpRequest.sendGet(paths.BASE_USERS + paths.PATH_USERS_GETUSER_WITH_ID + '/' + clientId, function(response, err) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit('getWpUser succeeded with user: ', JSON.stringify(response));
            user = response;
            callback(response);
          }
        });
      }
    };

    var updateAppUser = function(clientId, callback) {
      wpRequest.sendGet(paths.BASE_USERS + paths.PATH_USERS_GETUSER_WITH_ID + '/' + clientId, function(response, err) {
        if (err) {
          callback(null, err);
        } else {
          wpLogger.audit('getWpUser succeeded with user: ', JSON.stringify(response));
          user = response;
          callback(response);
        }
      });
    }

    var removeUser = function() {
      user = null;
    }


    return {
      getWpUser: getWpUser,
      updateAppUser: updateAppUser,
      removeUser: removeUser,
      user: user
    };
  });
