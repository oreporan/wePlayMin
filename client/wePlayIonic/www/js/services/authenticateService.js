angular.module('app.services')
  .service('authenticateService', function(logger, localStorageService, wpRequest, $http, paths, constants) {

      var wpLogger = logger.logger("authenticateService");

      // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
      var wpFacebookSignUp = function(facebookToken, callback) {

        wpRequest.sendPostWithoutClientId(paths.BASE_AUTHENTICATE + paths.PATH_AUTHENTICATE_FACEBOOK, {
          access_token: facebookToken
        }, function(response, err) {
          if (err) {
            wpLogger.error("wpFacebookSignUp", "client-id does not exist on the response");
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
        });
      };

    var signUp = function(userName, password, email) {
      var req = {
        method: 'POST',
        url: 'http://10.0.0.2:3000/wePlay/v1/auth/signup/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          name: userName,
          email: email,
          password: password
        }
      }

      $http(req).then(function successCallback(response) {
        return window.localStorage.wp_user = JSON.stringify(user);

      }, function errorCallback(response) {
        return wpLogger.error('signUp', error);

      });
    }

    return {
      wpFacebookSignUp: wpFacebookSignUp,
      signUp: signUp,
    };
  });
