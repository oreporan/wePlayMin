angular.module('app.services')
  .service('authenticateService', function(logger, localStorageService, userService, wpRequest, paths, constants) {

    var wpLogger = logger.logger("authenticateService");

    var wpFacebookSignUp = function(facebookToken, callback) {

      wpRequest.sendPostWithoutClientId(paths.BASE_AUTHENTICATE + paths.PATH_AUTHENTICATE_FACEBOOK, {
        access_token: facebookToken
      }, function(response, err) {
        if (err) {
          callback(null, err);
        } else {
          wpLogger.audit("wpFacebookSignUp", "response: " + response);

          var clientId = response["client-id"];
          if (!clientId) {
            wpLogger.error("wpFacebookSignUp", "client-id does not exist on the response");
            callback(null, "client-id does not exist on the response")
          } else {
            wpLogger.audit("wpFacebookSignUp", "clientId: " + clientId);
            localStorageService.setByKey(constants.STORAGE_CLIENTID, clientId);
            callback(clientId);
          }
        }
      })
    };

    var signUp = function(username, email, password, callback) {
      wpRequest.sendPostWithoutClientId(paths.BASE_AUTHENTICATE + paths.PATH_AUTHENTICATE_SIGNUP, {
        name: username,
        email: email,
        password: password
      }, function(response, err) {
        if (err) {
          callback(null, err);
        } else {
          var clientId = response["client-id"];
          if (!clientId) {
            wpLogger.error("signUp", "client-id does not exist on the response");
            callback(null, "client-id does not exist on the response")
          } else {
            wpLogger.audit("signUp", "clientId: " + clientId);
            localStorageService.setByKey(constants.STORAGE_CLIENTID, clientId);
            callback(clientId);
          }
        }
      })
    }

    var signIn = function(email, password, callback) {
      wpRequest.sendPostWithoutClientId(paths.BASE_AUTHENTICATE + paths.PATH_AUTHENTICATE_SIGNIN, {
        email: email,
        password: password
      }, function(response, err) {
        if (err) {
          callback(null, err);
        } else {
          var clientId = response["client-id"];
          if (!clientId) {
            wpLogger.error("signIn", "client-id does not exist on the response");
            callback(null, "client-id does not exist on the response")
          } else {
            wpLogger.audit("signIn", "clientId: " + clientId);
            localStorageService.setByKey(constants.STORAGE_CLIENTID, clientId);
            callback(clientId);
          }
        }
      })
    }

    var logout = function(callback) {
      if (ionic.Platform.isWebView()) {
        facebookConnectPlugin.logout(function(success){
          logoutSuccess();
          callback(null);
        }, function(error) {
          wpLogger.error('facebookLogout', "logout failed");
          callback(error);
        });
      } else {
        logoutSuccess();
        callback(null);
      }
    }

    function logoutSuccess() {
      wpLogger.audit('facebookLogout', "logout success");
      localStorageService.removeItem(constants.STORAGE_CLIENTID);
      userService.removeUser();
    }

    return {
      wpFacebookSignUp: wpFacebookSignUp,
      signUp: signUp,
      signIn: signIn,
      logout: logout
    };
  });
