angular.module('app.services')
  .service('userService', function(localStorageService, logger, wpRequest, paths, constants) {

    var wpLogger = logger.logger("userService");
    wpLogger.audit("getWpUser", "Server url: " + JSON.stringify(paths.SERVER_URL));


    // Holds user's instance
    var user;

    return {
      user: user,

      getUserById: function(clientId, callback) {
        if (user != null && user._id == clientId) {
          wpLogger.audit("getWpUser", "user already exist in app.");
          callback(user);
        } else {
          wpRequest.sendGet(paths.BASE_USERS + paths.PATH_USERS_GETUSER_WITH_ID + '/' + clientId, function(response, err) {
            if (err) {
              callback(null, err);
            } else {
              wpLogger.audit('getUserById succeeded with user: ', JSON.stringify(response));
              user = response;
              callback(response);
            }
          });
        }
      },

      getUserByName: function(name, callback) {
        wpRequest.sendGet(paths.BASE_USERS + paths.PATH_USERS_GETUSER_WITH_NAME + '/' + name, function(response, err) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit('getUserByName succeeded with user: ', JSON.stringify(response));
            user = response;
            callback(response);
          }
        });
      },

      getUsersListById: function(users, callback) {
        wpRequest.sendPost(paths.BASE_USERS + paths.PATH_USERS_GETUSERSLIST_BY_ID, {
          users: users
        }, function(response, err) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit('getUsersListById succeeded with user: ', JSON.stringify(response));
            user = response;
            callback(response);
          }
        });
      },

      updateAppUser: function(clientId, callback) {
        wpRequest.sendGet(paths.BASE_USERS + paths.PATH_USERS_GETUSER_WITH_ID + '/' + clientId, function(response, err) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit('updateAppUser succeeded with user: ', JSON.stringify(response));
            user = response;
            callback(response);
          }
        });
      },
      findUserByKeyword: function(keyword, callback) {
        wpRequest.sendGet(paths.BASE_USERS + paths.PATH_USERS_GETUSER_BY_KEYWORD + '/' + keyword, function(response, error) {
          if (err) {
            callback(null, err);
          } else {
            wpLogger.audit('Search for user succeeded with users: ', JSON.stringify(response));
            callback(response);
          }
        });
      },

      removeUser: function() {
        user = null;
      }

    }
  });
