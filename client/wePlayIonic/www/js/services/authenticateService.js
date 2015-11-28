angular.module('app.services')
  .service('authenticateService', function(logger, localStorageService, $http) {

    var wpLogger = logger.logger("authenticateService");

    // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var wpFacebookSignUp = function(facebookToken, callback) {

      wpLogger.audit("wpFacebookSignUp", facebookToken);
      var req = {
        method: 'POST',
        url: 'http://10.0.0.2:3000/wePlay/v1/auth/facebook/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          access_token: facebookToken
        }
      }

      $http(req).then(function successCallback(response) {

        if (!response.data || !response.data.responseText || !response.data.responseText["client-id"]) {
          return wpLogger.error("wpFacebookSignUp", "successCallback, response data is invalid");
        }

        var clientId = response.data.responseText["client-id"];
        wpLogger.audit("wpFacebookSignUp", "clientId: " + clientId);
        localStorageService.setByKey("wp_clientId", clientId);
        callback(clientId);

      }, function errorCallback(error) {
        callback(null, error);
      });


    };

    var signUp = function(userName, password, email) {
      var req = {
        method: 'POST',
        url: 'http://localhost:3000/wePlay/v1/auth/signup/',
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
