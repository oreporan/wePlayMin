angular.module('app.services')
  .service('userService', function(localStorageService, logger, wpRequest, paths, constants) {

    var wpLogger = logger.logger("userService");
    wpLogger.audit("getWpUser", "Server url: " + JSON.stringify(paths.SERVER_URL));

    var user;

    var getWpUser = function(clientId, callback) {
      if (user) {
        wpLogger.audit("getWpUser", "user exist in app");
        return user;
      } else {
        wpRequest.sendGet(paths.BASE_USERS + paths.PATH_USERS_GETUSER_WITH_ID + '/', clientId, function(response, err) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit('getWpUser succeeded with user: ', JSON.stringify(response));

            localStorageService.setByKey(constants.STORAGE_USER, response);
            callback(response);
          }
        });
      }
    };


    return {
      getWpUser: getWpUser
    };
  });
