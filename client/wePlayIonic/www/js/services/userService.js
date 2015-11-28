angular.module('app.services')
  .service('userService', function(localStorageService, logger, $http) {

    var wpLogger = logger.logger("userService");

    var user = null;

    var getWpUser = function(clientId, callback) {

      if (user) {
        wpLogger.audit("getWpUser", "user exist in app");

        return user;

      } else {
        wpLogger.audit("getWpUser", "trying to get user with clientId: " + clientId);

        $http.get('http://10.0.0.2:3000/wePlay/v1/users/getUser/' + clientId, {headers: {
          'client-id': clientId
        }}).then(function(resp) {
          console.log('Success', resp);
          // For JSON responses, resp.data contains the result
        }, function(err) {
          console.error('ERR', err);
          // err.status will contain the status code
        })

        var req = {
          method: 'GET',
          url: 'http://10.0.0.2:3000/wePlay/v1/users/getUser/' + clientId,
          headers: {
            'client-id': clientId
          }
        }

        $http(req).then(function successCallback(response) {

          wpLogger.audit("getWpUser", "succeeded to get user ");
          if (response.data || response.data.responseText) {
            return wpLogger.error("getWpUser", "successCallback, response data is invalid");
          }
          user = response.data.responseText.user;
          callback(user);
        }, function errorCallback(error) {
          wpLogger.error("getWpUser", JSON.stringify(error));
          callback(error);
        });
      }
    };


    return {
      getWpUser: getWpUser
    };
  });
